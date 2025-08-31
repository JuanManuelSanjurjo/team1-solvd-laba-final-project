import associateStripeCustomerToStrapi from "@/lib/actions/associate-stripe-customer-to-strapi";
import { auth } from "@/auth";
import { handleApiError } from "@/lib/normalizers/handle-api-error";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/lib/normalizers/handle-api-error");

describe("associateStripeCustomerToStrapi", () => {
  const mockAuth = auth as jest.Mock;
  const mockHandleApiError = handleApiError as jest.Mock;

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...OLD_ENV, NEXT_PUBLIC_API_URL: "http://api.local" };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("returns Unauthorized when no userId in session", async () => {
    mockAuth.mockResolvedValueOnce(null);

    const result = await associateStripeCustomerToStrapi({
      customerId: { id: "cus_123" } as any,
    });

    expect(result).toEqual({
      error: true,
      message: "Unauthorized",
    });
  });

  it("calls fetch with correct arguments when session exists", async () => {
    mockAuth.mockResolvedValueOnce({
      user: { id: "user123", jwt: "token-abc" },
    });

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    const result = await associateStripeCustomerToStrapi({
      customerId: { id: "cus_123" } as any,
    });

    expect(fetch).toHaveBeenCalledWith(
      "http://api.local/users/user123",
      expect.objectContaining({
        method: "PUT",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer token-abc",
        }),
        body: JSON.stringify({ customerId: "cus_123" }),
      })
    );
    expect(result).toEqual({
      error: false,
      message: "Success, details updated!",
    });
  });

  it("calls handleApiError when fetch fails", async () => {
    mockAuth.mockResolvedValueOnce({
      user: { id: "user123", jwt: "token-abc" },
    });

    const fakeResponse = {
      ok: false,
      status: 500,
      json: async () => ({ error: "Server error" }),
    } as any;

    global.fetch = jest.fn().mockResolvedValueOnce(fakeResponse);

    mockHandleApiError.mockResolvedValueOnce({
      error: true,
      message: "Handled error",
    });

    const result = await associateStripeCustomerToStrapi({
      customerId: { id: "cus_999" } as any,
    });

    expect(handleApiError).toHaveBeenCalledWith(
      fakeResponse,
      "Failed to update user"
    );
    expect(result).toEqual({
      error: true,
      message: "Handled error",
    });
  });
});
