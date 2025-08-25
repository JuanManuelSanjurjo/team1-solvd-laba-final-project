import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductDescription from "@/app/products/[product-id]/components/product-details/ProductDescription";
import { product as mockProduct } from "@/mocks/product";

describe("ProductDescription", () => {
  it("renders the description title", () => {
    render(<ProductDescription product={mockProduct} />);
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("renders the product description text", () => {
    render(<ProductDescription product={mockProduct} />);
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
  });

  it("renders nothing if product description is empty", () => {
    const productWithoutDescription = { ...mockProduct, description: "" };
    render(<ProductDescription product={productWithoutDescription} />);
    const descriptionNode = screen.getByTestId("product-description");
    expect(descriptionNode).toBeInTheDocument();
    expect(descriptionNode.textContent).toBe("");
  });
});
