import React from "react";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CheckoutPage from "@/app/(purchase)/checkout/page";
import type { Session } from "next-auth";

// Mocks
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/app/(purchase)/checkout/components/Checkout", () => {
  return function MockCheckout({ session }: { session: Session }) {
    return (
      <div data-testid="checkout" data-user-id={session.user?.id}>
        Checkout Component
      </div>
    );
  };
});

const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;
const mockAuth = auth as unknown as jest.MockedFunction<
  () => Promise<Session | null>
>;

const mockSession: Session = {
  expires: new Date().toISOString(),
  user: {
    id: "user123",
    username: "testuser",
    email: "test@example.com",
    jwt: "mock-jwt-token",
    avatar: null,
    firstName: "Test",
    lastName: "User",
    phone: null,
    customerId: null,
  },
};

describe("CheckoutPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to sign-in if no session", async () => {
    mockAuth.mockResolvedValue(null);

    await CheckoutPage();

    expect(mockRedirect).toHaveBeenCalledWith("/auth/sign-in");
  });

  it("redirects to sign-in if session has no userId", async () => {
    mockAuth.mockResolvedValue({ user: {} } as Session);

    await CheckoutPage();

    expect(mockRedirect).toHaveBeenCalledWith("/auth/sign-in");
  });

  it("renders Checkout with session when authenticated", async () => {
    mockAuth.mockResolvedValue(mockSession);

    const component = await CheckoutPage();
    render(component);

    const checkout = screen.getByTestId("checkout");
    expect(checkout).toBeInTheDocument();
    expect(checkout).toHaveAttribute("data-user-id", "user123");
  });
});
