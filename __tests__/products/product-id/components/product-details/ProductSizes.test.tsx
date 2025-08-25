import { render, screen } from "@testing-library/react";
import ProductSizes from "@/app/products/[product-id]/components/product-details/ProductSizes";
import { product as mockProduct } from "@/mocks/product";

const mockProductWithMoreSizes = {
  id: 1,
  name: "Nike Air Max 97",
  description: "",
  price: 100,
  sizes: [
    { id: 1, value: 45 },
    { id: 2, value: 34 },
    { id: 3, value: 23 },
    { id: 4, value: 12 },
  ],
  images: [],
  color: "Black",
  gender: "Men's shoes",
};

jest.mock("@/app/products/[product-id]/components/ShoeSizeOption", () => ({
  __esModule: true,
  default: function MockShoeSizeOption(props: { size: number }) {
    return <div data-testid="shoe-size-option" data-size={props.size} />;
  },
}));

describe("ProductSizes", () => {
  it("renders the title of the component", () => {
    render(<ProductSizes product={mockProduct} />);
    expect(screen.getByText("Select Size")).toBeInTheDocument();
  });

  it("renders the product sizes", () => {
    render(<ProductSizes product={mockProduct} />);

    const shoeSizeOptions = screen.getAllByTestId("shoe-size-option");
    expect(shoeSizeOptions).toHaveLength(mockProduct.sizes.length);
  });

  it("applies correct grid styles for many sizes", () => {
    render(<ProductSizes product={mockProductWithMoreSizes} />);

    const sizesContainer = screen.getByTestId("product-sizes");
    expect(sizesContainer).toHaveStyle("justify-content: space-between");
  });

  it("renders the fall back when no sizes are available", () => {
    const productWithoutSizes = { ...mockProduct, sizes: [] };
    render(<ProductSizes product={productWithoutSizes} />);
    expect(screen.getByText("No sizes available")).toBeInTheDocument();
  });

  it("renders fallbacm when no sizes are available", () => {
    const productWithoutSizes = { ...mockProduct, sizes: [] };
    render(<ProductSizes product={productWithoutSizes} />);
    expect(screen.getByText("No sizes available")).toBeInTheDocument();
  });
});
