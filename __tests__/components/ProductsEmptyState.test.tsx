import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ProductsEmptyState from "@/components/ProductsEmptyState";

describe("ProductsEmptyState", () => {
  const baseProps = {
    title: "No products yet",
    subtitle: "Start adding your first product",
  };

  it("renders title and subtitle", () => {
    render(<ProductsEmptyState {...baseProps} />);

    expect(screen.getByText(/no products yet/i)).toBeInTheDocument();
    expect(
      screen.getByText(/start adding your first product/i)
    ).toBeInTheDocument();
  });

  it("renders default Bag icon (expects at least one svg)", () => {
    render(<ProductsEmptyState {...baseProps} />);
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  it("renders custom icon when provided", () => {
    const CustomIcon: React.FC<{ size?: number; color?: string }> = () => (
      <svg data-testid="custom-icon" />
    );

    render(<ProductsEmptyState {...baseProps} icon={CustomIcon} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("does NOT render button if only buttonText is provided", () => {
    render(<ProductsEmptyState {...baseProps} buttonText="Add product" />);
    expect(
      screen.queryByRole("button", { name: /add product/i })
    ).not.toBeInTheDocument();
  });

  it("does NOT render button if only onClick is provided", () => {
    const onClick = jest.fn();
    render(<ProductsEmptyState {...baseProps} onClick={onClick} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders button when buttonText and onClick are provided", () => {
    const onClick = jest.fn();
    render(
      <ProductsEmptyState
        {...baseProps}
        buttonText="Add product"
        onClick={onClick}
      />
    );
    expect(
      screen.getByRole("button", { name: /add product/i })
    ).toBeInTheDocument();
  });

  it("calls onClick when the button is clicked", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(
      <ProductsEmptyState
        {...baseProps}
        buttonText="Add product"
        onClick={onClick}
      />
    );

    await user.click(screen.getByRole("button", { name: /add product/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
