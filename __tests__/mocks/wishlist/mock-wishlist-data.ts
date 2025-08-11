import cardProduct from "@/components/cards/actions/types/cardProduct";
import { useWishlistStore } from "@/store/wishlist";

type MockedWishlistStore = {
  wishList: cardProduct[];
  addToWishList: (product: cardProduct) => void;
  removeFromWishList: (productId: number) => void;
  clearWishList: () => void;
};

export const setupMockWishlistStore = (
  initialState: MockedWishlistStore["wishList"] = []
) => {
  const mockAddToWishList = jest.fn();
  const mockRemoveFromWishList = jest.fn();
  const mockClearWishList = jest.fn();

  const mockStoreState: MockedWishlistStore = {
    wishList: initialState,
    addToWishList: mockAddToWishList,
    removeFromWishList: mockRemoveFromWishList,
    clearWishList: mockClearWishList,
  };

  (useWishlistStore as any).mockImplementation(
    (selector: (state: MockedWishlistStore) => any) =>
      typeof selector === "function" ? selector(mockStoreState) : mockStoreState
  );

  return { mockAddToWishList, mockRemoveFromWishList, mockClearWishList };
};
