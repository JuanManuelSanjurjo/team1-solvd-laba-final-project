import { render, screen } from "@testing-library/react";
import SkeletonProductDetails from "@/components/skeletons/single-product/SkeletonProductDetails";

describe("SkeletonProductDetails Component", () => {
  it("should render the component", () => {
    render(<SkeletonProductDetails />);

    const skeletonProductDetails = screen.getByTestId(
      "skeleton-product-details",
    );
    expect(skeletonProductDetails).toBeInTheDocument();
  });
});
