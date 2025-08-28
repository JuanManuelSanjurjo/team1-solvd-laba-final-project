import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductQuantityButton from "../../../../src/app/(purchase)/cart/components/ProductQuantityButton";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { AllTheProviders } from "__tests__/utils/test-utils";

// Mock iconsax-react icons
jest.mock("iconsax-react", () => ({
  Add: ({ color, size, ...props }: any) => (
    <svg data-testid="add-icon" data-color={color} data-size={size} {...props}>
      <title>Add Icon</title>
    </svg>
  ),
  Minus: ({ color, size, ...props }: any) => (
    <svg
      data-testid="minus-icon"
      data-color={color}
      data-size={size}
      {...props}
    >
      <title>Minus Icon</title>
    </svg>
  ),
}));

describe("ProductQuantityButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders Add button with correct icon", () => {
      render(
        <AllTheProviders>
          <ProductQuantityButton operation="Add" />
        </AllTheProviders>
      );

      const button = screen.getByRole("button");
      const addIcon = screen.getByTestId("add-icon");

      expect(button).toBeInTheDocument();
      expect(addIcon).toBeInTheDocument();
      expect(screen.queryByTestId("minus-icon")).not.toBeInTheDocument();
    });

    it("renders Minus button with correct icon", () => {
      render(
        <AllTheProviders>
          <ProductQuantityButton operation="Minus" />
        </AllTheProviders>
      );

      const button = screen.getByRole("button");
      const minusIcon = screen.getByTestId("minus-icon");

      expect(button).toBeInTheDocument();
      expect(minusIcon).toBeInTheDocument();
      expect(screen.queryByTestId("add-icon")).not.toBeInTheDocument();
    });
  });

  describe("Icon Properties", () => {
    it("renders Add icon with correct color and size", () => {
      render(
        <AllTheProviders>
          <ProductQuantityButton operation="Add" />
        </AllTheProviders>
      );

      const addIcon = screen.getByTestId("add-icon");
      expect(addIcon).toHaveAttribute("data-color", "#FE645E");
      expect(addIcon).toHaveAttribute("data-size", "12");
    });

    it("renders Minus icon with correct color and size", () => {
      render(
        <AllTheProviders>
          <ProductQuantityButton operation="Minus" />
        </AllTheProviders>
      );

      const minusIcon = screen.getByTestId("minus-icon");
      expect(minusIcon).toHaveAttribute("data-color", "#CECECE");
      expect(minusIcon).toHaveAttribute("data-size", "12");
    });
  });

  describe("Event Handling", () => {
    it("handles click events", () => {
      const handleClick = jest.fn();
      render(
        <AllTheProviders>
          <ProductQuantityButton operation="Add" onClick={handleClick} />
        </AllTheProviders>
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Props Forwarding", () => {
    it("forwards additional IconButton props", () => {
      render(
        <AllTheProviders>
          <ProductQuantityButton
            operation="Add"
            disabled={true}
            data-testid="custom-button"
          />
        </AllTheProviders>
      );

      const button = screen.getByTestId("custom-button");
      expect(button).toBeDisabled();
    });
  });
});
