import createStripeCustomer from "@/lib/actions/create-stripe-customer";
import { auth } from "@/auth";
import { getStripe } from "@/lib/get-stripe";
import associateStripeCustomerToStrapi from "@/lib/actions/associate-stripe-customer-to-strapi";

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/get-stripe", () => ({ getStripe: jest.fn() }));
jest.mock("@/lib/actions/associate-stripe-customer-to-strapi", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("createStripeCustomer", () => {
  const list = jest.fn();
  const create = jest.fn();

  const email = "user@example.com";

  beforeEach(() => {
    jest.clearAllMocks();
    (getStripe as jest.Mock).mockReturnValue({
      customers: {
        list,
        create,
      },
    });
  });

  it("returns Unauthorized when session has no user id", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const res = await createStripeCustomer({ email });

    expect(res).toEqual({ error: true, message: "Unauthorized" });
    expect(list).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
    expect(associateStripeCustomerToStrapi).not.toHaveBeenCalled();
  });

  it("when an existing customer is found, associates it and returns it", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "strapi_123" } });

    const existingCustomer = { id: "cus_111", email };
    list.mockResolvedValue({ data: [existingCustomer] });

    const res = await createStripeCustomer({ email });

    expect(list).toHaveBeenCalledWith({ email, limit: 1 });
    expect(create).not.toHaveBeenCalled();
    expect(associateStripeCustomerToStrapi).toHaveBeenCalledWith({
      customerId: existingCustomer as any,
    });
    expect(res).toEqual({
      error: false,
      customer: existingCustomer,
    });
  });

  it("creates a new customer when none exists, associates it and returns it with isExisting:false", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "strapi_456" } });

    list.mockResolvedValue({ data: [] });
    const newCustomer = { id: "cus_222", email };
    create.mockResolvedValue(newCustomer);

    const res = await createStripeCustomer({ email });

    expect(list).toHaveBeenCalledWith({ email, limit: 1 });
    expect(create).toHaveBeenCalledWith({
      email,
      metadata: { strapi_user_id: "strapi_456" },
    });
    expect(associateStripeCustomerToStrapi).toHaveBeenCalledWith({
      customerId: newCustomer as any,
    });
    expect(res).toEqual({
      error: false,
      customer: newCustomer,
      isExisting: false,
    });
  });

  it("returns error when Stripe create returns falsy", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "strapi_789" } });

    list.mockResolvedValue({ data: [] });
    create.mockResolvedValue(null);

    const res = await createStripeCustomer({ email });

    expect(res).toEqual({
      error: true,
      message: "Failed to create stripe customer",
    });
    expect(associateStripeCustomerToStrapi).not.toHaveBeenCalled();
  });

  it("catches thrown errors, logs and returns generic failure", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "strapi_000" } });

    const err = new Error("stripe down");
    list.mockRejectedValue(err);

    const logSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const res = await createStripeCustomer({ email });

    expect(logSpy).toHaveBeenCalledWith("Error in createStripeCustomer:", err);
    expect(res).toEqual({
      error: true,
      message: "Failed to create or retrieve stripe customer",
    });

    logSpy.mockRestore();
  });
});
