import { render, screen } from "@testing-library/react";
import SkeletonGallery from "@/components/skeletons/single-product/SkeletonGallery";

describe("SkeletonProductDetails Component", () => {
  it("should render the component", () => {
    render(<SkeletonGallery />);

    const skeletonProductDetails = screen.getByTestId("skeleton-gallery");
    expect(skeletonProductDetails).toBeInTheDocument();
  });
});
