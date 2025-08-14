import { render, screen, fireEvent } from "@testing-library/react";
import ProductPageButtons from "@/app/products/[product-id]/components/ProductPageButtons";
import "@testing-library/jest-dom";
import { setupMockWishlistStore } from "__tests__/mocks/wishlist/mock-wishlist-data";
import {
  mockCardProduct,
  mockNormalizedProduct,
} from "__tests__/mocks/shared/mock-product-card";

jest.mock("@/store/wishlist", () => ({
  useWishlistStore: jest.fn(),
}));

describe("ProductPageButtonWishlist", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display the "Add to wishlist" button if the product is not in the wishlist', () => {
    setupMockWishlistStore([]);

    render(
      <ProductPageButtons
        product={mockNormalizedProduct}
        cardProductInfo={mockCardProduct}
      />
    );

    const wishlistButton = screen.getByRole("button", {
      name: /Add to wishlist/i,
    });

    expect(wishlistButton).toBeInTheDocument();
  });

  it("should call addToWishList with the correct product info when the button is clicked", () => {
    const { mockAddToWishList } = setupMockWishlistStore([]);

    render(
      <ProductPageButtons
        product={mockNormalizedProduct}
        cardProductInfo={mockCardProduct}
      />
    );

    const wishlistButton = screen.getByRole("button", {
      name: /Add to wishlist/i,
    });

    fireEvent.click(wishlistButton);

    expect(mockAddToWishList).toHaveBeenCalledTimes(1);
    expect(mockAddToWishList).toHaveBeenCalledWith(mockCardProduct);
  });

  it('should not display the "Add to wishlist" button if the product is already in the wishlist', () => {
    setupMockWishlistStore([mockCardProduct]);

    render(
      <ProductPageButtons
        product={mockNormalizedProduct}
        cardProductInfo={mockCardProduct}
      />
    );

    const wishlistButton = screen.queryByRole("button", {
      name: /Add to wishlist/i,
    });
    expect(wishlistButton).not.toBeInTheDocument();
  });
});
