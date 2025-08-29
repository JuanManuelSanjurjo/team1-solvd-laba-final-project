import React from "react";
import { screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import checkOrderAuthor from "@/lib/actions/check-order-author";
import ThankYou from "@/app/(purchase)/thank-you/page";
import { render } from "__tests__/utils/test-utils";
import type { Session } from "next-auth";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));
jest.mock("@/lib/actions/check-order-author");
jest.mock("next/link", () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;
const mockAuth = auth as unknown as jest.MockedFunction<
  () => Promise<Session | null>
>;
const mockCheckOrderAuthor = checkOrderAuthor as jest.MockedFunction<
  typeof checkOrderAuthor
>;

type StripeUser = {
  id: string;
  email: string;
};

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
    customerId: null as StripeUser | null,
  },
};

describe("ThankYou Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Successful Order Display", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue(mockSession);
      mockCheckOrderAuthor.mockResolvedValue(true);
    });

    it("renders thank you message with order ID", async () => {
      const searchParams = Promise.resolve({ payment_intent: "pi_test123" });

      const component = await ThankYou({ searchParams });
      render(component);

      expect(screen.getByText("THANK YOU")).toBeInTheDocument();
      expect(screen.getByText("for your order")).toBeInTheDocument();
      expect(screen.getByText("pi_test123")).toBeInTheDocument();
    });

    it("displays order confirmation message", async () => {
      const searchParams = Promise.resolve({ payment_intent: "pi_test123" });

      const component = await ThankYou({ searchParams });
      render(component);

      expect(
        screen.getByText(
          /Your order has been received and is currently being processed/
        )
      ).toBeInTheDocument();
    });

    it("renders action buttons", async () => {
      const searchParams = Promise.resolve({ payment_intent: "pi_test123" });

      const component = await ThankYou({ searchParams });
      render(component);

      expect(screen.getByText("View order")).toBeInTheDocument();
      expect(screen.getByText("Continue shopping")).toBeInTheDocument();
    });

    it("displays delivery image", async () => {
      const searchParams = Promise.resolve({ payment_intent: "pi_test123" });

      const component = await ThankYou({ searchParams });
      render(component);

      const image = screen.getByAltText("delivery-image");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "/assets/images/thankyou-image.png");
    });
  });

  describe("Redirects", () => {
    it("redirects when no order ID provided", async () => {
      mockAuth.mockResolvedValue(mockSession);
      const searchParams = Promise.resolve({ payment_intent: "" });

      await ThankYou({ searchParams });

      expect(mockRedirect).toHaveBeenCalledWith("/checkout");
    });

    it("redirects when no session exists", async () => {
      mockAuth.mockResolvedValue(null);
      const searchParams = Promise.resolve({ payment_intent: "pi_test123" });

      await ThankYou({ searchParams });

      expect(mockRedirect).toHaveBeenCalledWith("/checkout");
    });

    it("redirects when order is not valid", async () => {
      mockAuth.mockResolvedValue(mockSession);
      mockCheckOrderAuthor.mockResolvedValue(false);
      const searchParams = Promise.resolve({ payment_intent: "pi_test123" });

      await ThankYou({ searchParams });

      expect(mockRedirect).toHaveBeenCalledWith("/checkout");
    });
  });

  describe("Order Validation", () => {
    it("calls checkOrderAuthor with correct parameters", async () => {
      mockAuth.mockResolvedValue(mockSession);
      mockCheckOrderAuthor.mockResolvedValue(true);
      const searchParams = Promise.resolve({ payment_intent: "pi_test123" });

      await ThankYou({ searchParams });

      expect(mockCheckOrderAuthor).toHaveBeenCalledWith(
        "pi_test123",
        mockSession
      );
    });
  });
});
