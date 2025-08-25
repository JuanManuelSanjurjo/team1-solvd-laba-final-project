import { render, screen, fireEvent } from "@testing-library/react";
import ProductPageButtons from "@/app/products/[product-id]/components/product-details/ProductPageButtons";
import "@testing-library/jest-dom";
import { setupMockWishlistStore } from "__tests__/mocks/wishlist/mock-wishlist-data";
import {
  MOCK_CARD_PRODUCT as mockCardProduct,
  MOCK_NORMALIZED_PRODUCT as mockNormalizedProduct,
} from "__tests__/mocks/shared/mock-product-card";
import { Session } from "next-auth";

jest.mock("@/store/wishlist-store", () => ({
  useWishlistStore: jest.fn(),
}));

const session: Session = {
  user: { id: "user1", username: "John", email: "", jwt: "" },
  expires: "",
};

describe("ProductPageButtonWishlist", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display the "Add to wishlist" button if the product is not in the wishlist', () => {
    setupMockWishlistStore({});

    render(
      <ProductPageButtons
        product={mockNormalizedProduct}
        cardProductInfo={mockCardProduct}
        session={session}
      />,
    );

    const wishlistButton = screen.getByText("Add to wishlist");

    expect(wishlistButton).toBeInTheDocument();
  });

  it("should call addToWishList with the correct product info when the button is clicked", () => {
    const { mockAddToWishList } = setupMockWishlistStore({
      [mockCardProduct.id]: [mockCardProduct],
    });

    render(
      <ProductPageButtons
        product={mockNormalizedProduct}
        cardProductInfo={mockCardProduct}
        session={session}
      />,
    );

    const wishlistButton = screen.getByText("Add to wishlist");

    fireEvent.click(wishlistButton);

    expect(mockAddToWishList).toHaveBeenCalledTimes(1);
    expect(mockAddToWishList).toHaveBeenCalledWith("user1", mockCardProduct);
  });

  it("renders disabled buttons when session is null", () => {
    setupMockWishlistStore({});

    render(
      <ProductPageButtons
        product={mockNormalizedProduct}
        cardProductInfo={mockCardProduct}
        session={null}
      />,
    );

    const wishlistButton = screen.getByText("Add to wishlist");
    const cartButton = screen.getByRole("button", { name: /Add to cart/i });

    expect(wishlistButton).toBeDisabled();
    expect(cartButton).toBeDisabled();
  });
});
