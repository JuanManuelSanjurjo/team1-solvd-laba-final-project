import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import cardProduct from "@/components/cards/actions/types";

type MockedRecentlyViewedStore = {
  byUser: Record<string, cardProduct[]>;
  addToRecentlyViewed: (userId: string, product: cardProduct) => void;
  clearRecentlyViewed: (userId: string) => void;
  removeInactiveProducts: (userId: string, ids: number[]) => void;
};

export const setupMockRecentlyViewedStore = (
  byUser: Record<string, cardProduct[]> = { "123": [] }
) => {
  const mockAddToRecentlyViewed = jest.fn();
  const mockClearRecentlyViewed = jest.fn();
  const mockRemoveInactiveProducts = jest.fn();

  const mockStoreState: MockedRecentlyViewedStore = {
    byUser,
    addToRecentlyViewed: mockAddToRecentlyViewed,
    clearRecentlyViewed: mockClearRecentlyViewed,
    removeInactiveProducts: mockRemoveInactiveProducts,
  };

  (useRecentlyViewedStore as any).mockImplementation(
    (selector: (state: MockedRecentlyViewedStore) => any) =>
      typeof selector === "function" ? selector(mockStoreState) : mockStoreState
  );

  return {
    mockAddToRecentlyViewed,
    mockClearRecentlyViewed,
    mockRemoveInactiveProducts,
  };
};
