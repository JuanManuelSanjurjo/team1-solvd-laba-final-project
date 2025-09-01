import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import Cart from "@/app/(purchase)/cart/components/Cart";
import { useCartStore } from "@/store/cart-store";
import { CartItem } from "@/app/(purchase)/cart/types";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/store/cart-store", () => ({
  useCartStore: jest.fn(),
}));

jest.mock("@/components/ProductsEmptyState", () => (props: any) => (
  <div data-testid="products-empty-state">
    <h3>{props.title}</h3>
    <p>{props.subtitle}</p>
    <button onClick={props.onClick}>{props.buttonText}</button>
  </div>
));

jest.mock("@/app/(purchase)/cart/components/CartCard", () => (props: any) => (
  <div data-testid="cart-card" data-product-id={props.id}>
    <span>Product: {props.productTitle}</span>
    <span>Quantity: {props.quantity}</span>
    <span>Size: {props.size}</span>
    <span>Gender: {props.gender}</span>
  </div>
));

jest.mock("@/app/(purchase)/components/CheckoutSummary", () => (props: any) => (
  <div data-testid="checkout-summary">
    <button onClick={props.buttonAction} disabled={props.disabled}>
      {props.buttonText}
    </button>
  </div>
));

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseCartStore = useCartStore as jest.MockedFunction<
  typeof useCartStore
>;

const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: "Test Shoe 1",
    price: 99.99,
    quantity: 2,
    size: 42,
    gender: "Men",
    image: "https://example.com/shoe1.jpg",
  },
  {
    id: 2,
    name: "Test Shoe 2",
    price: 149.99,
    quantity: 1,
    size: 38,
    gender: "Women",
    image: "https://example.com/shoe2.jpg",
  },
];

describe("Cart Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  describe("Empty Cart State", () => {
    beforeEach(() => {
      mockUseCartStore.mockImplementation((selector) =>
        selector({
          byUser: {},
          addItem: jest.fn(),
          removeItem: jest.fn(),
          totalItems: jest.fn(() => 0),
          clearCart: jest.fn(),
          updateQuantity: jest.fn(),
          totalOfProduct: jest.fn(() => 0),
          subtotal: jest.fn(() => 0),
          taxes: jest.fn(() => 0),
          shipping: jest.fn(() => 0),
          total: jest.fn(() => 0),
        })
      );
    });

    it("renders empty cart state when no items in cart", () => {
      render(<Cart userId="user-123" />);

      expect(screen.getByText("Cart")).toBeInTheDocument();
      expect(screen.getByTestId("products-empty-state")).toBeInTheDocument();
      expect(
        screen.getByText("You don't have any products yet")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Browse our products and find your perfect pair!")
      ).toBeInTheDocument();
    });

    it("navigates to products page when Add Product button is clicked", async () => {
      const user = userEvent.setup();
      render(<Cart userId="user-123" />);

      const addProductButton = screen.getByText("Add Product");
      await user.click(addProductButton);

      expect(mockPush).toHaveBeenCalledWith("/products");
    });

    it("renders empty cart state when userId is empty string", () => {
      mockUseCartStore.mockImplementation((selector) =>
        selector({
          byUser: { "user-123": mockCartItems },
          addItem: jest.fn(),
          removeItem: jest.fn(),
          totalItems: jest.fn(() => 3),
          clearCart: jest.fn(),
          updateQuantity: jest.fn(),
          totalOfProduct: jest.fn(() => 199.98),
          subtotal: jest.fn(() => 199.98),
          taxes: jest.fn(() => 20.0),
          shipping: jest.fn(() => 10.0),
          total: jest.fn(() => 229.98),
        })
      );

      render(<Cart userId="" />);

      expect(screen.getByTestId("products-empty-state")).toBeInTheDocument();
    });

    it("renders empty cart state when user has no cart items", () => {
      mockUseCartStore.mockImplementation((selector) =>
        selector({
          byUser: { "user-123": [] },
          addItem: jest.fn(),
          removeItem: jest.fn(),
          totalItems: jest.fn(() => 0),
          clearCart: jest.fn(),
          updateQuantity: jest.fn(),
          totalOfProduct: jest.fn(() => 0),
          subtotal: jest.fn(() => 0),
          taxes: jest.fn(() => 0),
          shipping: jest.fn(() => 0),
          total: jest.fn(() => 0),
        })
      );

      render(<Cart userId="user-123" />);

      expect(screen.getByTestId("products-empty-state")).toBeInTheDocument();
    });
  });

  describe("Cart with Items", () => {
    beforeEach(() => {
      mockUseCartStore.mockImplementation((selector) =>
        selector({
          byUser: { "user-123": mockCartItems },
          addItem: jest.fn(),
          removeItem: jest.fn(),
          totalItems: jest.fn(() => 3),
          clearCart: jest.fn(),
          updateQuantity: jest.fn(),
          totalOfProduct: jest.fn(() => 199.98),
          subtotal: jest.fn(() => 199.98),
          taxes: jest.fn(() => 20.0),
          shipping: jest.fn(() => 10.0),
          total: jest.fn(() => 229.98),
        })
      );
    });

    it("renders cart items when cart has products", () => {
      render(<Cart userId="user-123" />);

      expect(screen.getByText("Cart")).toBeInTheDocument();
      expect(screen.getByText("Back to products")).toBeInTheDocument();
      expect(screen.getAllByTestId("cart-card")).toHaveLength(2);
      expect(screen.getByTestId("checkout-summary")).toBeInTheDocument();
    });

    it("renders correct cart item details", () => {
      render(<Cart userId="user-123" />);

      expect(screen.getByText("Product: Test Shoe 1")).toBeInTheDocument();
      expect(screen.getByText("Quantity: 2")).toBeInTheDocument();
      expect(screen.getByText("Size: 42")).toBeInTheDocument();
      expect(screen.getByText("Gender: Men")).toBeInTheDocument();

      expect(screen.getByText("Product: Test Shoe 2")).toBeInTheDocument();
      expect(screen.getByText("Quantity: 1")).toBeInTheDocument();
      expect(screen.getByText("Size: 38")).toBeInTheDocument();
      expect(screen.getByText("Gender: Women")).toBeInTheDocument();
    });

    it("navigates to checkout when checkout button is clicked", async () => {
      const user = userEvent.setup();
      render(<Cart userId="user-123" />);

      const checkoutButton = screen.getByText("Checkout");
      await user.click(checkoutButton);

      expect(mockPush).toHaveBeenCalledWith("/checkout");
    });

    it("renders back to products link with correct href", () => {
      render(<Cart userId="user-123" />);

      const backLink = screen.getByText("Back to products");
      expect(backLink).toBeInTheDocument();
      expect(backLink.closest("a")).toHaveAttribute("href", "/products");
    });

    it("passes correct props to CartCard components", () => {
      render(<Cart userId="user-123" />);

      const cartCards = screen.getAllByTestId("cart-card");
      expect(cartCards[0]).toHaveAttribute("data-product-id", "1");
      expect(cartCards[1]).toHaveAttribute("data-product-id", "2");
    });

    it("passes correct props to CheckoutSummary component", () => {
      render(<Cart userId="user-123" />);

      const checkoutButton = screen.getByText("Checkout");
      expect(checkoutButton).not.toBeDisabled();
    });

    it("generates unique keys for cart items using id + size", () => {
      const sameProductDifferentSizes: CartItem[] = [
        {
          id: 1,
          name: "Test Shoe",
          price: 99.99,
          quantity: 1,
          size: 42,
          gender: "Men",
          image: "https://example.com/shoe.jpg",
        },
        {
          id: 1,
          name: "Test Shoe",
          price: 99.99,
          quantity: 1,
          size: 44,
          gender: "Men",
          image: "https://example.com/shoe.jpg",
        },
      ];

      mockUseCartStore.mockImplementation((selector) =>
        selector({
          byUser: { "user-123": sameProductDifferentSizes },
          addItem: jest.fn(),
          removeItem: jest.fn(),
          totalItems: jest.fn(() => 2),
          clearCart: jest.fn(),
          updateQuantity: jest.fn(),
          totalOfProduct: jest.fn(() => 99.99),
          subtotal: jest.fn(() => 199.98),
          taxes: jest.fn(() => 20.0),
          shipping: jest.fn(() => 10.0),
          total: jest.fn(() => 229.98),
        })
      );

      render(<Cart userId="user-123" />);

      const cartCards = screen.getAllByTestId("cart-card");
      expect(cartCards).toHaveLength(2);
      expect(screen.getByText("Size: 42")).toBeInTheDocument();
      expect(screen.getByText("Size: 44")).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    const { useMediaQuery } = require("@mui/material");

    beforeEach(() => {
      mockUseCartStore.mockImplementation((selector) =>
        selector({
          byUser: { "user-123": mockCartItems },
          addItem: jest.fn(),
          removeItem: jest.fn(),
          totalItems: jest.fn(() => 3),
          clearCart: jest.fn(),
          updateQuantity: jest.fn(),
          totalOfProduct: jest.fn(() => 199.98),
          subtotal: jest.fn(() => 199.98),
          taxes: jest.fn(() => 20.0),
          shipping: jest.fn(() => 10.0),
          total: jest.fn(() => 229.98),
        })
      );
    });

    it("renders dividers", () => {
      useMediaQuery.mockReturnValue(false);
      render(<Cart userId="user-123" />);

      const dividers = screen.getAllByRole("separator");
      expect(dividers).toHaveLength(mockCartItems.length);
    });
  });

  describe("Edge Cases and Data Handling", () => {
    it("handles cart items with missing optional fields gracefully", () => {
      const incompleteCartItems: CartItem[] = [
        {
          id: 1,
          name: "Test Shoe",
          price: 99.99,
          quantity: 1,
          size: 0,
          gender: undefined,
          image: undefined,
        },
      ];

      mockUseCartStore.mockImplementation((selector) =>
        selector({
          byUser: { "user-123": incompleteCartItems },
          addItem: jest.fn(),
          removeItem: jest.fn(),
          totalItems: jest.fn(() => 1),
          clearCart: jest.fn(),
          updateQuantity: jest.fn(),
          totalOfProduct: jest.fn(() => 99.99),
          subtotal: jest.fn(() => 99.99),
          taxes: jest.fn(() => 10.0),
          shipping: jest.fn(() => 5.0),
          total: jest.fn(() => 114.99),
        })
      );

      render(<Cart userId="user-123" />);

      expect(screen.getByText("Product: Test Shoe")).toBeInTheDocument();
      expect(screen.getByText("Size: 0")).toBeInTheDocument();
      expect(screen.getByText("Gender:")).toBeInTheDocument();
    });

    it("handles different user IDs correctly", () => {
      mockUseCartStore.mockImplementation((selector) =>
        selector({
          byUser: {
            "user-123": mockCartItems,
            "user-456": [],
          },
          addItem: jest.fn(),
          removeItem: jest.fn(),
          totalItems: jest.fn(() => 3),
          clearCart: jest.fn(),
          updateQuantity: jest.fn(),
          totalOfProduct: jest.fn(() => 199.98),
          subtotal: jest.fn(() => 199.98),
          taxes: jest.fn(() => 20.0),
          shipping: jest.fn(() => 10.0),
          total: jest.fn(() => 229.98),
        })
      );

      const { rerender } = render(<Cart userId="user-123" />);
      expect(screen.getAllByTestId("cart-card")).toHaveLength(2);

      rerender(<Cart userId="user-456" />);
      expect(screen.getByTestId("products-empty-state")).toBeInTheDocument();
    });

    it("handles undefined byUser for specific userId", () => {
      mockUseCartStore.mockImplementation((selector) =>
        selector({
          byUser: { "other-user": mockCartItems },
          addItem: jest.fn(),
          removeItem: jest.fn(),
          totalItems: jest.fn(() => 0),
          clearCart: jest.fn(),
          updateQuantity: jest.fn(),
          totalOfProduct: jest.fn(() => 0),
          subtotal: jest.fn(() => 0),
          taxes: jest.fn(() => 0),
          shipping: jest.fn(() => 0),
          total: jest.fn(() => 0),
        })
      );

      render(<Cart userId="user-123" />);

      expect(screen.getByTestId("products-empty-state")).toBeInTheDocument();
    });

    it("handles empty cart gracefully with disabled checkout", () => {
      mockUseCartStore.mockImplementation((selector) =>
        selector({
          byUser: { "user-123": [] },
          addItem: jest.fn(),
          removeItem: jest.fn(),
          totalItems: jest.fn(() => 0),
          clearCart: jest.fn(),
          updateQuantity: jest.fn(),
          totalOfProduct: jest.fn(() => 0),
          subtotal: jest.fn(() => 0),
          taxes: jest.fn(() => 0),
          shipping: jest.fn(() => 0),
          total: jest.fn(() => 0),
        })
      );

      render(<Cart userId="user-123" />);

      expect(screen.getByTestId("products-empty-state")).toBeInTheDocument();
      expect(screen.queryByTestId("checkout-summary")).not.toBeInTheDocument();
    });
  });

  describe("Cart Store Integration", () => {
    it("handles cart store state changes", () => {
      mockUseCartStore.mockImplementation((selector) =>
        selector({
          byUser: {},
          addItem: jest.fn(),
          removeItem: jest.fn(),
          totalItems: jest.fn(() => 0),
          clearCart: jest.fn(),
          updateQuantity: jest.fn(),
          totalOfProduct: jest.fn(() => 0),
          subtotal: jest.fn(() => 0),
          taxes: jest.fn(() => 0),
          shipping: jest.fn(() => 0),
          total: jest.fn(() => 0),
        })
      );

      const { rerender } = render(<Cart userId="user-123" />);
      expect(screen.getByTestId("products-empty-state")).toBeInTheDocument();

      mockUseCartStore.mockImplementation((selector) =>
        selector({
          byUser: { "user-123": mockCartItems },
          addItem: jest.fn(),
          removeItem: jest.fn(),
          totalItems: jest.fn(() => 3),
          clearCart: jest.fn(),
          updateQuantity: jest.fn(),
          totalOfProduct: jest.fn(() => 199.98),
          subtotal: jest.fn(() => 199.98),
          taxes: jest.fn(() => 20.0),
          shipping: jest.fn(() => 10.0),
          total: jest.fn(() => 229.98),
        })
      );

      rerender(<Cart userId="user-123" />);
      expect(screen.getAllByTestId("cart-card")).toHaveLength(2);
    });
  });
});
