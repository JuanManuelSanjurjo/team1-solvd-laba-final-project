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

/**
 * @function
 * @returns {RecentlyViewedStore} - A recently viewed store instance.
 *
 * @example
 * const recentlyViewedStore = useRecentlyViewedStore();
 */
export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      byUser: {},
      max: 10,

      /**
       * @function
       * @param {string} userId - The user id.
       * @param {cardProduct} product - The product.
       * @returns {void}
       *
       * @example
       * useRecentlyViewedStore.getState().addToRecentlyViewed("1", { id: 1, name: "Product 1" });
       */
      addToRecentlyViewed: (userId, product) => {
        const { byUser, max } = get();
        const list = byUser[userId] ?? [];
        const filtered = list.filter((prod) => prod.id !== product.id);
        const next = [product, ...filtered].slice(0, max);
        set({ byUser: { ...byUser, [userId]: next } });
      },

      /**
       * @function
       * @param {string} userId - The user id.
       * @returns {void}
       *
       * @example
       * useRecentlyViewedStore.getState().clearRecentlyViewed("1");
       */
      clearRecentlyViewed: (userId) => {
        const { byUser } = get();
        const list = byUser[userId];
        if (!list || list.length === 0) return;
        set({ byUser: { ...byUser, [userId]: [] } });
      },

      /**
       * @function
       * @param {string} userId - The user id.
       * @param {number[]} ids - The product ids.
       * @returns {void}
       *
       * @example
       * useRecentlyViewedStore.getState().removeInactiveProducts("1", [1, 2, 3]);
       */
      removeInactiveProducts: (userId, ids) => {
        const { byUser } = get();
        const list = byUser[userId];
        if (!list || list.length === 0 || !ids?.length) return;
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
