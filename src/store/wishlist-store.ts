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

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      byUser: {},

      addToWishList: (userId, product) => {
        const { byUser } = get();
        const list = byUser[userId] ?? [];
        if (!list.some((prod) => prod.id === product.id)) {
          set({ byUser: { ...byUser, [userId]: [...list, product] } });
        }
      },

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

      clearWishList: (userId) => {
        const { byUser } = get();
        const list = byUser[userId];
        if (!list || list.length === 0) return;
        set({ byUser: { ...byUser, [userId]: [] } });
      },

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
