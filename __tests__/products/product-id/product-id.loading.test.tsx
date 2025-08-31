import Loading from "@/app/products/[product-id]/loading";
import { render, screen } from "@testing-library/react";

jest.mock(
  "@/components/skeletons/single-product/SkeletonProductPage",
  () => () => <div data-testid="skeleton-product-page" />
);

describe("Loading component", () => {
  it("renders Loading component with skeletons", () => {
    render(<Loading />);

    expect(screen.getByTestId("skeleton-product-page")).toBeInTheDocument();
  });
});
