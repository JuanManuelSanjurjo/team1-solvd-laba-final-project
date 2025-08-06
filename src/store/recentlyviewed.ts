import { create } from "zustand";
import { persist } from "zustand/middleware";
import cardProduct from "@/components/cards/actions/types/cardProduct";

type RecentlyViewedStore = {
  recentlyViewed: cardProduct[];
  addToRecentlyViewed: (product: cardProduct) => void;
  clearRecentlyViewed: () => void;
};

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      recentlyViewed: [],
      addToRecentlyViewed: (product) => {
        const current = get().recentlyViewed;

        const filtered = current.filter((prod) => prod.id !== product.id);

        const updated = [product, ...filtered].slice(0, 10);

        set({ recentlyViewed: updated });
      },
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),
    }),
    {
      name: "recently-viewed-products",
    }
  )
);
