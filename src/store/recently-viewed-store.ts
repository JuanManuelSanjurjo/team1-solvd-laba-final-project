import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import cardProduct from "@/components/cards/actions/types";

type RecentlyViewedStore = {
  byUser: Record<string, cardProduct[]>;
  max: number;
  addToRecentlyViewed: (userId: string, product: cardProduct) => void;
  clearRecentlyViewed: (userId: string) => void;
  removeInactiveProducts: (userId: string, productsIds: number[]) => void;
};

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      byUser: {},
      max: 10,
      addToRecentlyViewed: (userId, product) => {
        const { byUser, max } = get();
        const list = byUser[userId] ?? [];
        const filtered = list.filter((prod) => prod.id !== product.id);
        const next = [product, ...filtered].slice(0, max);
        set({ byUser: { ...byUser, [userId]: next } });
      },

      clearRecentlyViewed: (userId) => {
        const { byUser } = get();
        set({ byUser: { ...byUser, [userId]: [] } });
      },
      removeInactiveProducts: (userId, ids) => {
        const { byUser } = get();
        const list = byUser[userId] ?? [];
        const toRemove = new Set(ids);
        set({
          byUser: {
            ...byUser,
            [userId]: list.filter((prod) => !toRemove.has(prod.id)),
          },
        });
      },
    }),
    {
      name: "recently-viewed-products-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ byUser: state.byUser, max: state.max }),
    }
  )
);
