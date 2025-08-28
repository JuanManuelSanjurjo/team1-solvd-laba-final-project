import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { useMediaQuery } from "@mui/material";
import QuantityHandler from "@/app/(purchase)/cart/components/QuantityHandler";
import { useCartStore } from "@/store/cart-store";
import { render } from "__tests__/utils/test-utils";

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn(),
}));

jest.mock("@/store/cart-store");
jest.mock("iconsax-react", () => ({
  ArrowDown2: ({ size, color }: { size: string; color: string }) => (
    <div data-testid="arrow-down-icon" data-size={size} data-color={color} />
  ),
}));

jest.mock("@/app/(purchase)/cart/components/ProductQuantityButton", () => {
  return function MockProductQuantityButton({
    onClick,
    operation,
  }: {
    onClick: () => void;
    operation: string;
  }) {
    return (
      <button
        data-testid={`quantity-button-${operation.toLowerCase()}`}
        onClick={onClick}
      >
        {operation}
      </button>
    );
  };
});

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<
  typeof useMediaQuery
>;
const mockUseCartStore = useCartStore as jest.MockedFunction<
  typeof useCartStore
>;
const mockUpdateQuantity = jest.fn();

const defaultProps = {
  quantity: 2,
  id: 1,
  userId: "user123",
  size: 42,
};

describe("QuantityHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCartStore.mockReturnValue(mockUpdateQuantity);
  });

  describe("Desktop View", () => {
    beforeEach(() => {
      mockUseMediaQuery.mockReturnValue(false);
    });

    it("renders desktop layout with quantity controls", () => {
      render(<QuantityHandler {...defaultProps} />);

      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("Quantity")).toBeInTheDocument();
      expect(screen.getByTestId("quantity-button-minus")).toBeInTheDocument();
      expect(screen.getByTestId("quantity-button-add")).toBeInTheDocument();
    });

    it("calls updateQuantity when buttons are clicked", () => {
      render(<QuantityHandler {...defaultProps} />);

      fireEvent.click(screen.getByTestId("quantity-button-add"));
      expect(mockUpdateQuantity).toHaveBeenCalledWith("user123", 1, "add", 42);

      fireEvent.click(screen.getByTestId("quantity-button-minus"));
      expect(mockUpdateQuantity).toHaveBeenCalledWith(
        "user123",
        1,
        "minus",
        42
      );
    });
  });

  describe("Mobile View", () => {
    beforeEach(() => {
      mockUseMediaQuery.mockReturnValue(true);
    });

    it("renders mobile accordion layout", () => {
      render(<QuantityHandler {...defaultProps} />);

      expect(screen.getByText("Quantity")).toBeInTheDocument();
      expect(screen.getByTestId("arrow-down-icon")).toBeInTheDocument();
    });

    it("shows quantity controls in accordion details", () => {
      render(<QuantityHandler {...defaultProps} />);

      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByTestId("quantity-button-minus")).toBeInTheDocument();
      expect(screen.getByTestId("quantity-button-add")).toBeInTheDocument();
    });

    it("calls updateQuantity when mobile buttons are clicked", () => {
      render(<QuantityHandler {...defaultProps} />);

      fireEvent.click(screen.getByTestId("quantity-button-add"));
      expect(mockUpdateQuantity).toHaveBeenCalledWith("user123", 1, "add", 42);

      fireEvent.click(screen.getByTestId("quantity-button-minus"));
      expect(mockUpdateQuantity).toHaveBeenCalledWith(
        "user123",
        1,
        "minus",
        42
      );
    });
  });

  describe("Props Handling", () => {
    beforeEach(() => {
      mockUseMediaQuery.mockReturnValue(false);
    });

    it("displays correct quantity value", () => {
      render(<QuantityHandler {...defaultProps} quantity={5} />);
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("passes correct parameters to updateQuantity", () => {
      const customProps = {
        quantity: 3,
        id: 999,
        userId: "custom-user",
        size: 38,
      };

      render(<QuantityHandler {...customProps} />);

      fireEvent.click(screen.getByTestId("quantity-button-add"));
      expect(mockUpdateQuantity).toHaveBeenCalledWith(
        "custom-user",
        999,
        "add",
        38
      );
    });
  });
});
