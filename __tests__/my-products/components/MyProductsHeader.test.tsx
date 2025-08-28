import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import MyProductsHeader from "@/app/(side-bar)/my-products/components/MyProductsHeader";

afterEach(() => {
  jest.resetAllMocks();
  cleanup();
});

describe("MyProductsHeader", () => {
  test("renders Add Product button when isEmpty is false", () => {
    render(<MyProductsHeader isEmpty={false} />);

    const addButton = screen.getByRole("link", { name: /Add Product/i });
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveAttribute("href", "/my-products/add-product");
  });

  test("does not render Add Product button when isEmpty is true", () => {
    render(<MyProductsHeader isEmpty={true} />);
    expect(screen.queryByRole("link", { name: /Add Product/i })).toBeNull();
  });
});
