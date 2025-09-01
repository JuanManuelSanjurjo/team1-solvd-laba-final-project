import ProductLayout from "@/app/products/[product-id]/layout";
import { render, screen } from "__tests__/utils/test-utils";

describe("Single Product Page Layout", () => {
  it("should render without crashing", () => {
    const gallery = <h1>Gallery</h1>;
    const productDetails = <h1>Product Details</h1>;

    render(
      <ProductLayout
        gallery={gallery}
        productDetails={productDetails}
      ></ProductLayout>
    );

    expect(screen.getByText("Gallery")).toBeInTheDocument();
    expect(screen.getByText("Product Details")).toBeInTheDocument();
  });
});
