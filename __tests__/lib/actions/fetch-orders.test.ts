import { fetchOrders } from "@/lib/actions/fetch-orders";
import { auth } from "@/auth";
import { getStripe } from "@/lib/get-stripe";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));
jest.mock("@/lib/get-stripe", () => ({
  getStripe: jest.fn(),
}));

describe("fetchOrders", () => {
  const mockList = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getStripe as jest.Mock).mockReturnValue({
      charges: {
        list: mockList,
      },
    });
  });

  it("returns Unauthorized when there is no session", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const res = await fetchOrders();

    expect(res).toEqual({
      error: true,
      message: "Unauthorized",
      data: [],
    });
    expect(getStripe).toHaveBeenCalledTimes(1);
    expect(mockList).not.toHaveBeenCalled();
  });

  it("returns error when session exists but customerId is missing", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: {} });

    const res = await fetchOrders();

    expect(res).toEqual({
      error: true,
      message: "Customer ID not found",
      data: [],
    });
    expect(getStripe).toHaveBeenCalledTimes(1);
    expect(mockList).not.toHaveBeenCalled();
  });

  it("returns error when no orders are found", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { customerId: "cus_123" },
    });
    mockList.mockResolvedValue({ data: [] });

    const res = await fetchOrders();

    expect(mockList).toHaveBeenCalledWith({ customer: "cus_123" });
    expect(res).toEqual({
      error: true,
      message: "No orders found",
      data: [],
    });
  });

  it("returns data when charges exist (happy path)", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { customerId: "cus_123" },
    });

    const fakeCharges = [
      {
        id: "ch_1",
        amount: 1000,
        currency: "usd",
        metadata: { strapi_user_id: "42", items: '[{"id":1}]' },
      },
    ];

    mockList.mockResolvedValue({ data: fakeCharges });

    const res = await fetchOrders();

    expect(mockList).toHaveBeenCalledWith({ customer: "cus_123" });
    expect(res).toEqual({
      error: false,
      message: "",
      data: fakeCharges as any,
    });
  });

  it("returns error when Stripe throws", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { customerId: "cus_123" },
    });
    mockList.mockRejectedValue(new Error("stripe down"));

    const res = await fetchOrders();

    expect(mockList).toHaveBeenCalledWith({ customer: "cus_123" });
    expect(res).toEqual({
      error: true,
      message: "Failed to fetch orders",
      data: [],
    });
  });
});
