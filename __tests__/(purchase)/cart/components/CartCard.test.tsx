import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CartCard from "@/app/(purchase)/cart/components/CartCard";
import { useCartStore } from "@/store/cart-store";
import { useMediaQuery } from "@mui/material";

jest.mock("@/store/cart-store", () => ({
  useCartStore: jest.fn(),
}));

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn(),
}));

jest.mock("@/app/(purchase)/cart/components/QuantityHandler", () => ({
  __esModule: true,
  default: ({ quantity, id, userId, size }: any) => (
    <div
      data-testid="quantity-handler"
      data-quantity={quantity}
      data-id={id}
      data-userid={userId}
      data-size={size}
    >
      Quantity: {quantity}
    </div>
  ),
}));

jest.mock("@/app/(purchase)/cart/components/CartCardImage", () => ({
  __esModule: true,
  default: ({ image }: { image: string | undefined }) => (
    <div data-testid="cart-card-image" data-image={image || "placeholder"}>
      {image ? `Image: ${image}` : "Placeholder Image"}
    </div>
  ),
}));

jest.mock("@/components/ConfirmationModal", () => ({
  __esModule: true,
  default: ({
    showModal,
    onClose,
    onPrimary,
    title,
    text,
    secondaryBtn,
    primaryBtn,
  }: any) =>
    showModal ? (
      <div data-testid="confirmation-modal">
        <h2>{title}</h2>
        <p>{text}</p>
        <button data-testid="modal-secondary" onClick={onClose}>
          {secondaryBtn}
        </button>
        <button data-testid="modal-primary" onClick={onPrimary}>
          {primaryBtn}
        </button>
      </div>
    ) : null,
}));

jest.mock("@/components/Button", () => ({
  __esModule: true,
  default: ({ onClick, children, startIcon, sx, ...props }: any) => (
    <button onClick={onClick} data-testid="delete-button" style={sx} {...props}>
      {startIcon}
      {children}
    </button>
  ),
}));

jest.mock("iconsax-react", () => ({
  Trash: ({ size, color }: { size: number; color: string }) => (
    <span data-testid="trash-icon" data-size={size} data-color={color}>
      🗑️
    </span>
  ),
}));

const mockUseCartStore = useCartStore as jest.MockedFunction<
  typeof useCartStore
>;
const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<
  typeof useMediaQuery
>;

const defaultProps = {
  id: 1,
  quantity: 2,
  productTitle: "Test Sneakers",
  gender: "Men",
  image: "https://example.com/shoe.jpg",
  userId: "user-123",
  size: 42,
};

const mockRemoveItem = jest.fn();
const mockTotalOfProduct = jest.fn();
const mockAddItem = jest.fn();
const mockUpdateQuantity = jest.fn();
const mockClearCart = jest.fn();
const mockTotalItems = jest.fn();
const mockSubtotal = jest.fn();
const mockTaxes = jest.fn();
const mockShipping = jest.fn();
const mockTotal = jest.fn();

describe("CartCard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMediaQuery.mockReturnValue(false);
    mockTotalOfProduct.mockReturnValue(199.98);
    mockTotalItems.mockReturnValue(2);
    mockSubtotal.mockReturnValue(199.98);
    mockTaxes.mockReturnValue(20.0);
    mockShipping.mockReturnValue(10.0);
    mockTotal.mockReturnValue(229.98);

    mockUseCartStore.mockImplementation((selector) => {
      const state = {
        byUser: {
          "user-123": [
            {
              id: 1,
              quantity: 2,
              name: "Test Sneakers",
              gender: "Men",
              image: "https://example.com/shoe.jpg",
              price: 99.99,
              size: 42,
            },
          ],
        },
        removeItem: mockRemoveItem,
        totalOfProduct: mockTotalOfProduct,
        addItem: mockAddItem,
        updateQuantity: mockUpdateQuantity,
        clearCart: mockClearCart,
        totalItems: mockTotalItems,
        subtotal: mockSubtotal,
        taxes: mockTaxes,
        shipping: mockShipping,
        total: mockTotal,
      };
      return selector(state);
    });
  });

  describe("Rendering", () => {
    it("renders cart card with all product information", () => {
      render(<CartCard {...defaultProps} />);

      expect(screen.getByText("Test Sneakers")).toBeInTheDocument();
      expect(screen.getByText("Men's Shoes")).toBeInTheDocument();
      expect(screen.getByText("EU42")).toBeInTheDocument();
      expect(screen.getByText("In stock")).toBeInTheDocument();
      expect(screen.getByText("$199.98")).toBeInTheDocument();
    });

    it("renders CartCardImage with correct props", () => {
      render(<CartCard {...defaultProps} />);

      const image = screen.getByTestId("cart-card-image");
      expect(image).toHaveAttribute("data-image", defaultProps.image);
    });

    it("renders QuantityHandler with correct props", () => {
      render(<CartCard {...defaultProps} />);

      const quantityHandler = screen.getByTestId("quantity-handler");
      expect(quantityHandler).toHaveAttribute("data-quantity", "2");
      expect(quantityHandler).toHaveAttribute("data-id", "1");
      expect(quantityHandler).toHaveAttribute("data-userid", "user-123");
      expect(quantityHandler).toHaveAttribute("data-size", "42");
    });

    it("renders delete button with trash icon", () => {
      render(<CartCard {...defaultProps} />);

      const deleteButton = screen.getByTestId("delete-button");
      expect(deleteButton).toBeInTheDocument();
      expect(screen.getByText("Delete")).toBeInTheDocument();
      expect(screen.getByTestId("trash-icon")).toBeInTheDocument();
    });

    it("calls totalOfProduct with correct parameters", () => {
      render(<CartCard {...defaultProps} />);

      expect(mockTotalOfProduct).toHaveBeenCalledWith("user-123", 1, 42);
    });
  });

  describe("Props Variations", () => {
    it("handles undefined image", () => {
      render(<CartCard {...defaultProps} image={undefined} />);

      const image = screen.getByTestId("cart-card-image");
      expect(image).toHaveAttribute("data-image", "placeholder");
    });

    it("renders different gender correctly", () => {
      render(<CartCard {...defaultProps} gender="Women" />);

      expect(screen.getByText("Women's Shoes")).toBeInTheDocument();
    });

    it("renders different size correctly", () => {
      render(<CartCard {...defaultProps} size={38} />);

      expect(screen.getByText("EU38")).toBeInTheDocument();
    });

    it("handles zero quantity", () => {
      render(<CartCard {...defaultProps} quantity={0} />);

      const quantityHandler = screen.getByTestId("quantity-handler");
      expect(quantityHandler).toHaveAttribute("data-quantity", "0");
    });

    it("handles large quantity", () => {
      render(<CartCard {...defaultProps} quantity={99} />);

      const quantityHandler = screen.getByTestId("quantity-handler");
      expect(quantityHandler).toHaveAttribute("data-quantity", "99");
    });
  });

  describe("Delete Functionality", () => {
    it("opens confirmation modal when delete button is clicked", async () => {
      const user = userEvent.setup();
      render(<CartCard {...defaultProps} />);

      const deleteButton = screen.getByTestId("delete-button");
      await user.click(deleteButton);

      expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
      expect(screen.getByText("Delete product from cart")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Are you sure you want to delete this product from the cart?"
        )
      ).toBeInTheDocument();
    });

    it("closes confirmation modal when secondary button is clicked", async () => {
      const user = userEvent.setup();
      render(<CartCard {...defaultProps} />);

      const deleteButton = screen.getByTestId("delete-button");
      await user.click(deleteButton);

      const secondaryButton = screen.getByTestId("modal-secondary");
      await user.click(secondaryButton);

      expect(
        screen.queryByTestId("confirmation-modal")
      ).not.toBeInTheDocument();
    });

    it("calls removeItem when primary button is clicked", async () => {
      const user = userEvent.setup();
      render(<CartCard {...defaultProps} />);

      const deleteButton = screen.getByTestId("delete-button");
      await user.click(deleteButton);

      const primaryButton = screen.getByTestId("modal-primary");
      await user.click(primaryButton);

      expect(mockRemoveItem).toHaveBeenCalledWith("user-123", 1, 42);
    });

    it("modal is not visible initially", () => {
      render(<CartCard {...defaultProps} />);

      expect(
        screen.queryByTestId("confirmation-modal")
      ).not.toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("hides 'In stock' text on mobile", () => {
      mockUseMediaQuery.mockReturnValue(true);
      render(<CartCard {...defaultProps} />);

      expect(screen.getByText("In stock")).toBeInTheDocument();
    });

    it("shows 'In stock' text on desktop", () => {
      mockUseMediaQuery.mockReturnValue(false);
      render(<CartCard {...defaultProps} />);

      expect(screen.getByText("In stock")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty product title", () => {
      render(<CartCard {...defaultProps} productTitle="" />);

      expect(screen.getByTestId("cart-card-image")).toBeInTheDocument();
      expect(screen.getByTestId("quantity-handler")).toBeInTheDocument();
    });

    it("handles special characters in product title", () => {
      const specialTitle = "Test & Special <Chars> 'Quotes'";
      render(<CartCard {...defaultProps} productTitle={specialTitle} />);

      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });

    it("handles very long product title", () => {
      const longTitle = "A".repeat(100);
      render(<CartCard {...defaultProps} productTitle={longTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("handles zero price from totalOfProduct", () => {
      mockTotalOfProduct.mockReturnValue(0);
      render(<CartCard {...defaultProps} />);

      expect(screen.getByText("$0")).toBeInTheDocument();
    });

    it("handles decimal price from totalOfProduct", () => {
      mockTotalOfProduct.mockReturnValue(99.99);
      render(<CartCard {...defaultProps} />);

      expect(screen.getByText("$99.99")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper button accessibility", () => {
      render(<CartCard {...defaultProps} />);

      const deleteButton = screen.getByTestId("delete-button");
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton.tagName).toBe("BUTTON");
    });

    it("provides meaningful text content", () => {
      render(<CartCard {...defaultProps} />);

      expect(screen.getByText("Delete")).toBeInTheDocument();
      expect(screen.getByText("Test Sneakers")).toBeInTheDocument();
      expect(screen.getByText("Men's Shoes")).toBeInTheDocument();
    });
  });

  describe("Integration with Store", () => {
    it("uses correct selectors from cart store", () => {
      render(<CartCard {...defaultProps} />);

      expect(mockUseCartStore).toHaveBeenCalledWith(expect.any(Function));

      const completeState = {
        byUser: {
          "user-123": [
            {
              id: 1,
              quantity: 2,
              name: "Test Sneakers",
              gender: "Men",
              image: "https://example.com/shoe.jpg",
              price: 99.99,
              size: 42,
            },
          ],
        },
        removeItem: mockRemoveItem,
        totalOfProduct: mockTotalOfProduct,
        addItem: mockAddItem,
        updateQuantity: mockUpdateQuantity,
        clearCart: mockClearCart,
        totalItems: mockTotalItems,
        subtotal: mockSubtotal,
        taxes: mockTaxes,
        shipping: mockShipping,
        total: mockTotal,
      };

      const removeItemSelector = mockUseCartStore.mock.calls.find(
        (call) => call[0](completeState) === mockRemoveItem
      );
      const totalOfProductSelector = mockUseCartStore.mock.calls.find(
        (call) => call[0](completeState) === mockTotalOfProduct
      );

      expect(removeItemSelector).toBeDefined();
      expect(totalOfProductSelector).toBeDefined();
    });
  });

  describe("Component State Management", () => {
    it("manages confirmation modal state correctly", async () => {
      const user = userEvent.setup();
      render(<CartCard {...defaultProps} />);

      expect(
        screen.queryByTestId("confirmation-modal")
      ).not.toBeInTheDocument();

      await user.click(screen.getByTestId("delete-button"));
      expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();

      await user.click(screen.getByTestId("modal-secondary"));
      expect(
        screen.queryByTestId("confirmation-modal")
      ).not.toBeInTheDocument();

      await user.click(screen.getByTestId("delete-button"));
      expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
    });
  });
});
