import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import cardProduct from "@/components/cards/actions/types";

type MockedRecentlyViewedStore = {
  recentlyViewed: cardProduct[];
  addToRecentlyViewed: (product: cardProduct) => void;
  clearRecentlyViewed: () => void;
};

export const setupMockRecentlyViewedStore = (
  initialState: MockedRecentlyViewedStore["recentlyViewed"] = []
) => {
  const mockAddToRecentlyViewed = jest.fn();
  const mockClearRecentlyViewed = jest.fn();

  const mockStoreState: MockedRecentlyViewedStore = {
    recentlyViewed: initialState,
    addToRecentlyViewed: mockAddToRecentlyViewed,
    clearRecentlyViewed: mockClearRecentlyViewed,
  };

  (useRecentlyViewedStore as any).mockImplementation(
    (selector: (state: MockedRecentlyViewedStore) => any) =>
      typeof selector === "function" ? selector(mockStoreState) : mockStoreState
  );

  return { mockAddToRecentlyViewed, mockClearRecentlyViewed };
};
