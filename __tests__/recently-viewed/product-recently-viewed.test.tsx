import ProductPageDetails from "@/app/products/[product-id]/components/ProductPageDetails";
import {
  mockCardProduct,
  mockNormalizedProduct,
} from "__tests__/mocks/shared/mock-product-card";
import { setupMockRecentlyViewedStore } from "__tests__/mocks/recently-viewed/mock-recentlyviewed-data";
import { render } from "@testing-library/react";

jest.mock("@/store/recentlyviewed", () => ({
  useRecentlyViewedStore: jest.fn(),
}));

describe("ProductPageRecentlyViewed", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call addToRecentlyViewed with the product info when the component renders", () => {
    const { mockAddToRecentlyViewed } = setupMockRecentlyViewedStore();

    render(<ProductPageDetails product={mockNormalizedProduct} />);

    expect(mockAddToRecentlyViewed).toHaveBeenCalledTimes(1);
    expect(mockAddToRecentlyViewed).toHaveBeenCalledWith(mockCardProduct);
  });

  it("should not call addToRecentlyViewed on subsequent renders if product info is unchanged", () => {
    const { mockAddToRecentlyViewed } = setupMockRecentlyViewedStore();

    const { rerender } = render(
      <ProductPageDetails product={mockNormalizedProduct} />
    );

    expect(mockAddToRecentlyViewed).toHaveBeenCalledTimes(1);

    rerender(<ProductPageDetails product={mockNormalizedProduct} />);

    expect(mockAddToRecentlyViewed).toHaveBeenCalledTimes(1);
  });
});
