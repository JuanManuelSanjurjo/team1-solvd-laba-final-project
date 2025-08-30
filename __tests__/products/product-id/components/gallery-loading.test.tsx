import { render, screen } from "@testing-library/react";
import React from "react";
import Loading from "@/app/products/[product-id]/@gallery/loading";

jest.mock("@/components/skeletons/single-product/SkeletonGallery", () => () => (
  <div data-testid="skeleton-gallery">Mocked SkeletonGallery</div>
));

describe("Loading component", () => {
  it("renders without crashing", () => {
    render(<Loading />);
  });

  it("renders the SkeletonGallery component", () => {
    render(<Loading />);
    expect(screen.getByTestId("skeleton-gallery")).toBeInTheDocument();
    expect(screen.getByText("Mocked SkeletonGallery")).toBeInTheDocument();
  });

  it("does not render children or extra elements", () => {
    render(
      (
        <Loading>
          <div data-testid="child">Child content</div>
        </Loading>
      ) as any,
    );
    expect(screen.queryByTestId("child")).not.toBeInTheDocument();
  });
});
