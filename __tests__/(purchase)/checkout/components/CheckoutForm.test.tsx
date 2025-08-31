import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CheckoutForm from "@/app/(purchase)/checkout/components/CheckoutForm";
import { CartState } from "@/app/(purchase)/cart/types";

// Mocks
jest.mock("@/store/cart-store", () => ({
  useCartStore: jest.fn(),
}));

jest.mock("@/app/(purchase)/components/CheckoutSummary", () => {
  return function MockCheckoutSummary({ buttonText }: { buttonText: string }) {
    return <div data-testid="checkout-summary">{buttonText}</div>;
  };
});

jest.mock("@stripe/react-stripe-js", () => ({
  PaymentElement: ({ options }: any) => (
    <div data-testid="payment-element">{JSON.stringify(options)}</div>
  ),
  useStripe: () => null,
  useElements: () => null,
}));

const { useCartStore } = jest.requireMock("@/store/cart-store") as {
  useCartStore: jest.Mock;
};

//Render tests
describe("CheckoutForm - render: basic and conditional", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders titles and inputs", () => {
    const mockedState: Partial<CartState> = { byUser: { user123: [] } };
    useCartStore.mockImplementation((selector: any) =>
      selector(mockedState as CartState)
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
    useCartStore.mockImplementation((selector: any) =>
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
    useCartStore.mockImplementation((selector: any) =>
      selector(mockedState as CartState)
    );

    render(<CheckoutForm userId="user123" />);

    expect(screen.getByTestId("checkout-summary")).toBeInTheDocument();
    expect(screen.getByText("Confirm & Pay")).toBeInTheDocument();
  });
});
