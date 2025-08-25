import { render, screen } from "@testing-library/react";
import ProductMainData from "@/app/products/[product-id]/components/product-details/ProductMainData";
import { product as mockProduct } from "@/mocks/product";

describe("ProductMainData", () => {
  it("renders the product name", () => {
    render(<ProductMainData product={mockProduct} />);
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
  });

  it("renders the product price", () => {
    render(<ProductMainData product={mockProduct} />);
    expect(screen.getByText(`$ ${mockProduct.price}`)).toBeInTheDocument();
  });

  it("renders the product color", () => {
    render(<ProductMainData product={mockProduct} />);
    expect(screen.getByText(mockProduct.color)).toBeInTheDocument();
  });
});
