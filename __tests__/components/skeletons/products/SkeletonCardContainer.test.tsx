import { PRODUCTS_PER_PAGE } from "@/lib/constants/globals";
import SkeletonCardContainer from "@/components/skeletons/products/SkeletonCardContainer";
import { render, screen } from "__tests__/utils/test-utils";

describe("SkeletonCardContainer", () => {
  it("renders the container", () => {
    render(<SkeletonCardContainer />);
    const container = screen.getByTestId("skeleton-card-container");
    expect(container).toBeInTheDocument();
  });

  it(`renders ${PRODUCTS_PER_PAGE} skeleton cards`, () => {
    render(<SkeletonCardContainer />);
    const skeletons = screen.getAllByTestId("card-skeleton");
    expect(skeletons).toHaveLength(PRODUCTS_PER_PAGE);
  });
});
