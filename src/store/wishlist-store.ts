import cardProduct from "@/components/cards/actions/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type WishlistStore = {
  byUser: Record<string, cardProduct[]>;
  addToWishList: (userId: string, product: cardProduct) => void;
  removeFromWishList: (userId: string, productId: number) => void;
  clearWishList: (userId: string) => void;
  removeInactiveProducts: (userId: string, productsIds: number[]) => void;
};

/**
 * @function
 * @returns {WishlistStore} - A wishlist store instance.
 *
 * @example
 * const wishlistStore = useWishlistStore();
 */
export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      byUser: {},

      /**
       * @function
       * @param {string} userId - The user id.
       * @param {cardProduct} product - The product to add.
       * @returns {void}
       *
       * @example
       * useWishlistStore.getState().addToWishList("1", product);
       */
      addToWishList: (userId, product) => {
        const { byUser } = get();
        const list = byUser[userId] ?? [];
        if (!list.some((prod) => prod.id === product.id)) {
          set({ byUser: { ...byUser, [userId]: [...list, product] } });
        }
      },

      /**
       * @function
       * @param {string} userId - The user id.
       * @param {number} id - The product id.
       * @returns {void}
       *
       * @example
       * useWishlistStore.getState().removeFromWishList("1", 1);
       */
      removeFromWishList: (userId, id) => {
        const { byUser } = get();
        const list = byUser[userId];
        if (!list || list.length === 0) return;
        set({
          byUser: {
            ...byUser,
            [userId]: list.filter((prod) => prod.id !== id),
          },
        });
      },

      /**
       * @function
       * @param {string} userId - The user id.
       * @returns {void}
       *
       * @example
       * useWishlistStore.getState().clearWishList("1");
       */
      clearWishList: (userId) => {
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
       * useWishlistStore.getState().removeInactiveProducts("1", [1, 2, 3]);
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
      name: "wishlist-storage-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ byUser: state.byUser }),
    }
  )
);
