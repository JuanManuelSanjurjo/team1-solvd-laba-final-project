import React from "react";
import { render, screen } from "@testing-library/react";
import CheckoutForm from "@/app/(purchase)/checkout/components/CheckoutForm";
import { CartState } from "@/app/(purchase)/cart/types";
import { createMockCartState } from "__tests__/(purchase)/test-utils/cartState";
import { useCartStore } from "@/store/cart-store";

// Mocks
jest.mock("@/store/cart-store", () => ({
  useCartStore: jest.fn(),
}));

const mockUseCartStore = useCartStore as unknown as jest.Mock;

jest.mock("@/app/(purchase)/components/CheckoutSummary", () => {
  return function MockCheckoutSummary({ buttonText }: { buttonText: string }) {
    return (
      <button type="submit" data-testid="checkout-button">
        {buttonText}
      </button>
    );
  };
});

jest.mock("@stripe/react-stripe-js", () => ({
  PaymentElement: () => <div data-testid="payment-element">PaymentElement</div>,
  useStripe: () => null,
  useElements: () => null,
}));

//Render tests
describe("CheckoutForm - render: basic and conditional", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders titles and inputs", () => {
    mockUseCartStore.mockImplementation((selector: any) =>
      selector(createMockCartState([]))
    );

    render(<CheckoutForm userId="user123" />);

    expect(screen.getByText("Checkout")).toBeInTheDocument();
    expect(screen.getByText("Personal info")).toBeInTheDocument();
    expect(screen.getByText("Shipping info")).toBeInTheDocument();
    expect(screen.getByText("Payment info")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox").length).toBeGreaterThan(0);
    expect(screen.getByTestId("payment-element")).toBeInTheDocument();
  });

  it("not render CheckoutSummary if empty cart", () => {
    const mockedState: Partial<CartState> = { byUser: { user123: [] } };
    mockUseCartStore.mockImplementation((selector: any) =>
      selector(mockedState as CartState)
    );

    render(<CheckoutForm userId="user123" />);

    expect(screen.queryByTestId("checkout-summary")).not.toBeInTheDocument();
  });

  it("renders CheckoutSummary if items in cart", () => {
    const mockedState: Partial<CartState> = {
      byUser: {
        user123: [
          {
            id: 1,
            name: "Test Shoe",
            price: 100,
            image: "img.jpg",
            size: 42,
            gender: "Men",
            quantity: 1,
          },
        ],
      },
    };
    mockUseCartStore.mockImplementation((selector: any) =>
      selector(mockedState as CartState)
    );

    render(<CheckoutForm userId="user123" />);

    expect(screen.getByTestId("checkout-button")).toBeInTheDocument();
    expect(screen.getByText("Confirm & Pay")).toBeInTheDocument();
  });
});
