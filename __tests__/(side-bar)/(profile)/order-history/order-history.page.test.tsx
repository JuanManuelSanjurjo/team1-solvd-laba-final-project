import OrderHistory from "@/app/(side-bar)/(profile)/order-history/page";
import { render, screen } from "__tests__/utils/test-utils";
import { redirect } from "next/navigation";
import { fetchOrders, RetrievedOrder } from "@/lib/actions/fetch-orders";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/lib/actions/fetch-orders", () => ({
  fetchOrders: jest.fn(),
}));

const mockFetchOrders = fetchOrders as jest.MockedFunction<typeof fetchOrders>;

import { auth } from "@/auth";
import { validOrderData } from "__tests__/mocks/order-history";

const mockAuth = auth as jest.MockedFunction<any>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

describe("Order History Page", () => {
  it("should render without crashing", async () => {
    mockFetchOrders.mockImplementation(async () => ({
      data: validOrderData,
      error: false,
      message: "Success",
    }));

    const orderHistory = await OrderHistory();

    render(orderHistory);

    expect(screen.getByText("Order History")).toBeInTheDocument();
  });

  it("should render empty state if no orders are found", async () => {
    mockFetchOrders.mockImplementation(async () => ({
      data: [],
      error: false,
      message: "Success",
    }));

    const orderHistory = await OrderHistory();

    render(orderHistory);

    expect(
      screen.getByText("You don't have any orders yet")
    ).toBeInTheDocument();
  });
});
