import { getStripe } from "@/lib/get-stripe";
import Stripe from "stripe";

jest.mock("stripe");

describe("getStripe", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
  });

  it("throws an error if STRIPE_SECRET_KEY is not set", () => {
    delete process.env.STRIPE_SECRET_KEY;

    expect(() => getStripe()).toThrow("STRIPE_SECRET_KEY is not set");
  });

  it("creates a new Stripe instance if key is provided", () => {
    process.env.STRIPE_SECRET_KEY = "test_key";

    const stripeInstance = getStripe();

    expect(Stripe).toHaveBeenCalledWith("test_key");
    expect(stripeInstance).toBeInstanceOf(Stripe);
  });
});
