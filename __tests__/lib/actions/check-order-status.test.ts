import checkOrderAuthor from "@/lib/actions/check-order-author";
import { getStripe } from "@/lib/get-stripe";
import { Session } from "next-auth";

jest.mock("@/lib/get-stripe");

describe("checkOrderAuthor", () => {
  const mockedGetStripe = getStripe as jest.Mock;

  const session: Session = {
    user: {
      id: "user-123",
      customerId: "customer-123",
      username: "Test User",
      email: "test@example.com",
      jwt: "fake-token",
    },
    expires: "fake-date",
  };

  const mockPaymentIntent = (metadata: Record<string, string>) => ({
    metadata,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns true if paymentIntent metadata matches session user ID", async () => {
    const retrieveMock = jest
      .fn()
      .mockResolvedValue(mockPaymentIntent({ strapi_user_id: "user-123" }));

    mockedGetStripe.mockReturnValue({
      paymentIntents: { retrieve: retrieveMock },
    });

    const result = await checkOrderAuthor("order-1", session);
    expect(result).toBe(true);
    expect(retrieveMock).toHaveBeenCalledWith("order-1");
  });

  it("returns false if paymentIntent metadata does not match session user ID", async () => {
    const retrieveMock = jest
      .fn()
      .mockResolvedValue(mockPaymentIntent({ strapi_user_id: "other-user" }));

    mockedGetStripe.mockReturnValue({
      paymentIntents: { retrieve: retrieveMock },
    });

    const result = await checkOrderAuthor("order-1", session);
    expect(result).toBe(false);
  });

  it("returns false if getStripe throws an error", async () => {
    mockedGetStripe.mockImplementation(() => {
      throw new Error("Stripe error");
    });

    const result = await checkOrderAuthor("order-1", session);
    expect(result).toBe(false);
  });

  it("returns false if paymentIntents.retrieve rejects", async () => {
    const retrieveMock = jest
      .fn()
      .mockRejectedValue(new Error("Network error"));
    mockedGetStripe.mockReturnValue({
      paymentIntents: { retrieve: retrieveMock },
    });

    const result = await checkOrderAuthor("order-1", session);
    expect(result).toBe(false);
  });
});
