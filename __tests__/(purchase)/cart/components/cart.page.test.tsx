import React from "react";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CartPage from "@/app/(purchase)/cart/page";
import type { Session } from "next-auth";

// Mocks
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/app/(purchase)/cart/components/Cart", () => {
  return function MockCart({ userId }: { userId: string }) {
    return <div data-testid="cart" data-user-id={userId}>Cart Component</div>;
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
    customerId: null 
  },
};

// Testing
describe("CartPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to login if no session", async () => {
       mockAuth.mockResolvedValue(null);

    await CartPage();

    expect(mockRedirect).toHaveBeenCalledWith("/auth/log-in");
  });

  it("redirects to login if session has no userId", async () => {
     mockAuth.mockResolvedValue({ user: {} } as Session);

    await CartPage();

    expect(mockRedirect).toHaveBeenCalledWith("/auth/log-in");
  });

  it("renders Cart with userId when authenticated", async () => {
    mockAuth.mockResolvedValue(mockSession);

    const component = await CartPage();
    render(component);

    const cart = screen.getByTestId("cart");
    expect(cart).toBeInTheDocument();
    expect(cart).toHaveAttribute("data-user-id", "user123");  });
});
