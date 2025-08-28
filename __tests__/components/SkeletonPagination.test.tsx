import { render, screen } from "@testing-library/react";
import SkeletonPagination from "@/components/SkeletonPagination";

describe("SkeletonPagination", () => {
  it("renders 5 skeleton items", () => {
    render(<SkeletonPagination />);
    const skeletons = document.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons).toHaveLength(5);
  });

  it("renders the container Box with flex display", () => {
    render(<SkeletonPagination />);
    const container = screen.getByTestId("skeleton-pagination-container");
    expect(container).toHaveStyle("display: flex");
    expect(container).toHaveStyle("justify-content: center");
    expect(container).toHaveStyle("align-items: center");
    expect(container).toHaveStyle("margin-top: 50px");
    expect(container).toHaveStyle("margin-bottom: 100px");
  });
});
