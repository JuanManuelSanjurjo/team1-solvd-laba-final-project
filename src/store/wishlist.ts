//import { Product } from "@/types/product";
import cardProduct from "@/components/cards/actions/types/cardProduct";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistStore = {
  wishList: cardProduct[];
  addToWishList: (product: cardProduct) => void;
  removeFromWishList: (productId: number) => void;
  clearWishList: () => void;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishList: [],

      addToWishList: (product) => {
        const alreadyExists = get().wishList.some(
          (prod) => prod.id === product.id
        );
        if (!alreadyExists) {
          set((state) => ({
            wishList: [...state.wishList, product],
          }));
        }
        console.log("Added to wishlist performn");
      },

      removeFromWishList: (id) => {
        set((state) => ({
          wishList: state.wishList.filter((prod) => prod.id !== id),
        }));
      },

      clearWishList: () => {
        set({ wishList: [] });
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
);
