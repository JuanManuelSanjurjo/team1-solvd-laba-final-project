import { render, screen } from "@testing-library/react";
import React from "react";
import Loading from "@/app/products/[product-id]/@productDetails/loading";

jest.mock(
  "@/components/skeletons/single-product/SkeletonProductDetails",
  () => () => (
    <div data-testid="skeleton-product-details">
      Mocked SkeletonProductDetails
    </div>
  ),
);

describe("Loading (Product Details)", () => {
  it("renders without crashing", () => {
    render(<Loading />);
  });

  it("renders the SkeletonProductDetails component", () => {
    render(<Loading />);
    expect(screen.getByTestId("skeleton-product-details")).toBeInTheDocument();
    expect(
      screen.getByText("Mocked SkeletonProductDetails"),
    ).toBeInTheDocument();
  });

  it("does not render unexpected children", () => {
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
