import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CheckoutSummary from "@/app/(purchase)/components/CheckoutSummary";
import { useCartStore } from "@/store/cart-store";
import { testUserId } from "__tests__/(purchase)/test-utils/cart";

//Mocks
jest.mock("@/store/cart-store", () => ({
  useCartStore: jest.fn(),
}));
const mockUseCartStore = useCartStore as unknown as jest.Mock;

jest.mock("@/components/Button", () => {
  return function MockButton({ children, onClick, disabled }: any) {
    return (
      <button
        data-testid="checkout-button"
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };
});

//Testing
describe("CheckoutSummary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders subtotal, shipping, taxes and total correctly", () => {
    mockUseCartStore.mockImplementation((selector: any) =>
      selector({
        subtotal: () => 100,
        shipping: () => 10,
        taxes: () => 5,
        total: () => 115,
      })
    );

    render(
      <CheckoutSummary
        userId={testUserId}
        buttonText="Confirm & Pay"
        buttonAction={jest.fn()}
        disabled={false}
      />
    );

    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument(); // subtotal
    expect(screen.getByText("$10")).toBeInTheDocument(); // shipping
    expect(screen.getByText("$5")).toBeInTheDocument(); // taxes
    expect(screen.getByText("$115")).toBeInTheDocument(); // total
  });

  it("calls buttonAction when button is clicked", () => {
    const mockAction = jest.fn();

    mockUseCartStore.mockImplementation((selector: any) =>
      selector({
        subtotal: () => 50,
        shipping: () => 10,
        taxes: () => 5,
        total: () => 65,
      })
    );

    render(
      <CheckoutSummary
        userId={testUserId}
        buttonText="Checkout"
        buttonAction={mockAction}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Checkout/i }));
    expect(mockAction).toHaveBeenCalled();
  });

  it("disables button if disabled prop is true", () => {
    mockUseCartStore.mockImplementation((selector: any) =>
      selector({
        subtotal: () => 20,
        shipping: () => 5,
        taxes: () => 2,
        total: () => 27,
      })
    );

    render(
      <CheckoutSummary
        userId={testUserId}
        buttonText="Pay"
        buttonAction={jest.fn()}
        disabled={true}
      />
    );

    expect(screen.getByRole("button", { name: /Pay/i })).toBeDisabled();
  });
});
