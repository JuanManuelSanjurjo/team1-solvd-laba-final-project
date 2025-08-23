import cardProduct from "@/components/cards/actions/types";
import { useWishlistStore } from "@/store/wishlist-store";

type MockedWishlistStore = {
  byUser: Record<string, cardProduct[]>;
  addToWishList: (userId: string, product: cardProduct) => void;
  removeFromWishList: (userId: string, productId: number) => void;
  clearWishList: (userId: string) => void;
  removeInactiveProducts: (userId: string, productsIds: number[]) => void;
};

export const setupMockWishlistStore = (
  byUser: Record<string, cardProduct[]> = { "123": [] }
) => {
  const mockAddToWishList = jest.fn();
  const mockRemoveFromWishList = jest.fn();
  const mockClearWishList = jest.fn();
  const mockRemoveInactiveProducts = jest.fn();

  const mockStoreState: MockedWishlistStore = {
    byUser,
    addToWishList: mockAddToWishList,
    removeFromWishList: mockRemoveFromWishList,
    clearWishList: mockClearWishList,
    removeInactiveProducts: mockRemoveInactiveProducts,
  };

  (useWishlistStore as unknown as jest.Mock).mockImplementation(
    (selector?: (state: MockedWishlistStore) => any) =>
      typeof selector === "function" ? selector(mockStoreState) : mockStoreState
  );

  return {
    mockAddToWishList,
    mockRemoveFromWishList,
    mockClearWishList,
    mockRemoveInactiveProducts,
  };
};
