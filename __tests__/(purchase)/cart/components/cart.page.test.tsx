import React from "react";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CartPage from "@/app/(purchase)/cart/page";
import type { Session } from "next-auth";
import { mockSession } from "__tests__/(purchase)/test-utils/auth";
import { testUserId } from "__tests__/(purchase)/test-utils/cart";

// Mocks
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/app/(purchase)/cart/components/Cart", () => {
  return function MockCart({ userId }: { userId: string }) {
    return (
      <div data-testid="cart" data-user-id={userId}>
        Cart Component
      </div>
    );
  };
});

const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;
const mockAuth = auth as unknown as jest.MockedFunction<
  () => Promise<Session | null>
>;

// Testing
describe("CartPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should redirect to login if no session", async () => {
    mockAuth.mockResolvedValue(null);

    await CartPage();

    expect(mockRedirect).toHaveBeenCalledWith("/auth/log-in");
  });

  it("should redirect to login if session has no userId", async () => {
    mockAuth.mockResolvedValue({ user: {} } as Session);

    await CartPage();

    expect(mockRedirect).toHaveBeenCalledWith("/auth/log-in");
  });

  it("should render Cart with userId when authenticated", async () => {
    mockAuth.mockResolvedValue(mockSession);

    const component = await CartPage();
    render(component);

    const cart = screen.getByTestId("cart");
    expect(cart).toBeInTheDocument();
    expect(cart).toHaveAttribute("data-user-id", testUserId);
  });
});
