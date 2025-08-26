import { render, screen } from "@testing-library/react";
import ProductPageSkeleton from "@/components/skeletons/single-product/SkeletonProductPage";

describe("SkeletonProductPage Component", () => {
  it("should render the component", () => {
    render(<ProductPageSkeleton />);

    const skeletonProductPage = screen.getByTestId("skeleton-product-page");
    expect(skeletonProductPage).toBeInTheDocument();
  });
});
