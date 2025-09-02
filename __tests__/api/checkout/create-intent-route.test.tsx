import "@testing-library/jest-dom";

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));
jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/get-stripe", () => ({ getStripe: jest.fn() }));

jest.mock("stripe", () => {
  class StripeError extends Error {}
  return {
    __esModule: true,
    default: { errors: { StripeError } },
  };
});
import { POST } from "@/app/api/checkout/create-intent/route";
import { auth } from "@/auth";
import { getStripe } from "@/lib/get-stripe";
import Stripe from "stripe";

const fakeReq = (body: any) => ({ json: async () => body } as any);

describe("POST /api/checkout/create-intent", () => {
  const createMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (getStripe as jest.Mock).mockReturnValue({
      paymentIntents: { create: createMock },
    });
  });

  it("returns 401 when user is not authenticated", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const res = await POST(
      fakeReq({ amount: 10, customer: "cus_x", itemsLength: 0 })
    );
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: "Unauthorized" });
    expect(createMock).not.toHaveBeenCalled();
  });

  it("returns 400 on invalid amount", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "u_1" } });

    const res = await POST(
      fakeReq({ amount: 0, customer: "cus_x", itemsLength: 1 })
    );
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Invalid amount" });
    expect(createMock).not.toHaveBeenCalled();
  });

  it("creates payment intent and returns client secret + order id", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "user_123" } });

    const body = {
      amount: 123.45,
      customer: "cus_999",
      itemsLength: 2,
      item_a: {
        id: 1,
        image: "https://img/1.jpg",
        name: "A",
        price: 50,
        size: 42,
        gender: "Men",
        quantity: 1,
      },
      item_b: {
        id: 2,
        image: "https://img/2.jpg",
        name: "B",
        price: 73.45,
        size: 41,
        gender: "Women",
        quantity: 1,
      },
    };

    createMock.mockResolvedValue({
      id: "pi_123",
      client_secret: "cs_test_123",
    });

    const res = await POST(fakeReq(body));
    expect(res.status).toBe(200);

    const arg = createMock.mock.calls[0][0];
    expect(arg).toEqual(
      expect.objectContaining({
        amount: 12345,
        currency: "usd",
        customer: "cus_999",
        automatic_payment_methods: { enabled: true },
      })
    );
    expect(arg.metadata).toEqual(
      expect.objectContaining({
        strapi_user_id: "user_123",
        itemsLength: 2,
        item_a: JSON.stringify(body.item_a),
        item_b: JSON.stringify(body.item_b),
      })
    );

    await expect(res.json()).resolves.toEqual({
      clientSecret: "cs_test_123",
      orderId: "pi_123",
    });
  });

  it("maps StripeError to 400", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    (auth as jest.Mock).mockResolvedValue({ user: { id: "user_123" } });

    const StripeAny = Stripe as any;
    const err = new StripeAny.errors.StripeError("Card declined");

    const createMock = jest.fn().mockRejectedValue(err);
    (getStripe as jest.Mock).mockReturnValue({
      paymentIntents: { create: createMock },
    });

    const res = await POST(
      fakeReq({ amount: 10, customer: "cus_x", itemsLength: 0 })
    );
    expect(res.status).toBe(400);
    expect(logSpy).toHaveBeenCalledWith("error", "Card declined");
    logSpy.mockRestore();
    await expect(res.json()).resolves.toEqual({ error: "Card declined" });
  });
  it("maps unknown errors to 500", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    (auth as jest.Mock).mockResolvedValue({ user: { id: "user_123" } });
    createMock.mockRejectedValue(new Error("kaput"));

    const res = await POST(
      fakeReq({ amount: 10, customer: "cus_x", itemsLength: 0 })
    );
    expect(res.status).toBe(500);
    expect(logSpy).toHaveBeenCalledWith("Error");
    logSpy.mockRestore();
    await expect(res.json()).resolves.toEqual({
      error: "Unknown server error",
    });
  });
});
