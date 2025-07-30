import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

type RecentlyViewedStore = {
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
};

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      recentlyViewed: [],
      addToRecentlyViewed: (product) => {
        const current = get().recentlyViewed;

        const filtered = current.filter((p) => p.id !== product.id);

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
