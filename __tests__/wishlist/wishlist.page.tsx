import { render, screen, fireEvent } from "@testing-library/react";
import MyWishlist from "@/app/(side-bar)/my-wishlist/page";
import "@testing-library/jest-dom";
import { setupMockWishlistStore } from "__tests__/mocks/wishlist/mock-wishlist-data";
import {
  mockCardProduct,
  mockCardProduct2,
} from "__tests__/mocks/shared/mock-product-card";

jest.mock("zustand/middleware", () => ({
  ...jest.requireActual("zustand/middleware"),
  persist: <T,>(config: T) => config,
}));

jest.mock("@/store/wishlist", () => ({
  useWishlistStore: jest.fn(),
}));

describe("WishListPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display a list of products when the wishlist is not empty", () => {
    setupMockWishlistStore([mockCardProduct, mockCardProduct2]);

    render(<MyWishlist />);

    expect(
      screen.getByRole("heading", { name: /My Wishlist/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Mock snicker")).toBeInTheDocument();
    expect(screen.getByText("Mock snicker 2")).toBeInTheDocument();
  });

  it("should display a message when the wishlist is empty", () => {
    setupMockWishlistStore([]);

    render(<MyWishlist />);

    expect(
      screen.getByText(/No saved products in your wishlist/i)
    ).toBeInTheDocument();
    expect(screen.queryByText("Mock snicker")).not.toBeInTheDocument();
  });

  it("should call the removeFromWishList action when a product is removed", () => {
    const { mockRemoveFromWishList } = setupMockWishlistStore([
      mockCardProduct,
      mockCardProduct2,
    ]);

    render(<MyWishlist />);

    const toggleButton = screen.getAllByRole("button", {
      name: "Toggle wishlist",
    })[0];
    fireEvent.click(toggleButton);

    expect(mockRemoveFromWishList).toHaveBeenCalledWith(mockCardProduct.id);
  });
});
