import { render, screen, fireEvent } from "@testing-library/react";
import CardButtonWishList from "@/components/cards/actions/CardButtonWishList";
import "@testing-library/jest-dom";
import { setupMockWishlistStore } from "__tests__/mocks/wishlist/mock-wishlist-data";
import { mockCardProduct } from "__tests__/mocks/shared/mock-product-card";

jest.mock("@/store/wishlist", () => ({
  useWishlistStore: jest.fn(),
}));

describe("CardButtonWishList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show 'Outline' icon and call 'addToWishList' when the product is not in the list", () => {
    const { mockAddToWishList } = setupMockWishlistStore([]);

    render(<CardButtonWishList product={mockCardProduct} />);

    const icon = screen.getByTestId("heart-icon");
    expect(icon).toHaveAttribute("data-variant", "Outline");

    fireEvent.click(icon);
    expect(mockAddToWishList).toHaveBeenCalledWith(mockCardProduct);
  });

  it("should show 'Bold' icon and call 'removeFromWishList' when the product is already in the list", () => {
    const { mockRemoveFromWishList } = setupMockWishlistStore([
      mockCardProduct,
    ]);

    render(<CardButtonWishList product={mockCardProduct} />);

    const icon = screen.getByTestId("heart-icon");
    expect(icon).toHaveAttribute("data-variant", "Bold");

    fireEvent.click(icon);

    expect(mockRemoveFromWishList).toHaveBeenCalledWith(mockCardProduct.id);
  });
});
