import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useToastStore } from "./toastStore";

import type { CartItem, CartState } from "@/app/(purchase)/cart/types/types";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      byUser: {},

      addItem: (userId, item: CartItem) => {
        const { byUser } = get();

        if (userId!) {
          useToastStore.getState().show({
            severity: "error",
            message: "You need to log in first",
          });

          return;
        }

        const currentItems = byUser[userId] ?? [];

        //Search if any product in cart matches the one that is being added
        const itemAlreadyInCart = currentItems.find(
          (product) => product.id === item.id
        );

        //If product is already added to the cart we add 1 item to that existing element in cart
        if (itemAlreadyInCart) {
          set({
            byUser: {
              ...byUser,
              [userId]: currentItems.map((prod) =>
                prod.id === item.id
                  ? { ...prod, quantity: (prod.quantity || 1) + 1 }
                  : prod
              ),
            },
          });

          //If product isn't already in cart we add it
          console.log("Added item to product existing in cart", currentItems);
          useToastStore.getState().show({
            severity: "success",
            message: "Added item to product existing in cart",
          });
        } else {
          set({
            byUser: {
              ...byUser,
              [userId]: [...currentItems, { ...item, quantity: 1 }],
            },
          });
          useToastStore.getState().show({
            severity: "success",
            message: "Added item to cart",
          });
          console.log("Added item to cart", currentItems);
        }
      },

      totalItems: (userId) => {
        return (get().byUser[userId] ?? []).reduce(
          (sum, item) => sum + (item.quantity || 1),
          0
        );
      },

      removeItem: (userId, id) => {
        const { byUser } = get();

        set({
          byUser: {
            ...byUser,
            [userId]: (byUser[userId] ?? []).filter((item) => item.id !== id),
          },
        });
      },

      clearCart: (userId) => {
        const { byUser } = get();
        set({ byUser: { ...byUser, [userId]: [] } });
      },

      updateQuantity: (userId, id, action) => {
        const { byUser } = get();
        const list = byUser[userId] ?? [];

        const updatedItems = list.map((item) => {
          //If product doesn't match id, we return it as it is
          if (item.id !== id) return item;

          //If item matches id, we perform the correspondin action
          const newQuantity =
            action === "add"
              ? (item.quantity || 1) + 1
              : (item.quantity || 1) - 1;

          //Returns updated product. Minimum of 1 item
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        });

        //Update cart state
        set({ byUser: { ...byUser, [userId]: updatedItems } });
      },

      totalOfProduct: (userId, id) => {
        //Find the item that matches the id
        const { byUser } = get();

        const list = byUser[userId] ?? [];

        const item = list.find((product) => product.id === id);

        //If item exists, calculate total. If not, returns 0
        return item ? item.price * (item.quantity || 1) : 0;
      },

      subtotal: (userId) => {
        // Use totalOfProduct for each item to calculate total
        return (get().byUser[userId] ?? []).reduce(
          (sum, item) => sum + item.price * (item.quantity || 1),
          0
        );
      },

      taxes: (userId) => {
        const taxRate = 0.1; //10%
        return Math.round(get().subtotal(userId) * taxRate);
      },

      shipping: (userId) => {
        const minimumFreeShipping = 100;
        const shippingCost = 10;
        const total = get().subtotal(userId);

        if (total > minimumFreeShipping) {
          return 0;
        } else {
          return shippingCost;
        }
      },

      total: (userId) => {
        const subtotal = get().subtotal(userId);
        const taxes = get().taxes(userId);
        const shipping = get().shipping(userId);
        return subtotal + taxes + shipping;
      },
    }),
    {
      name: "cart-storage-v2", // clave en localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ byUser: state.byUser }),
    }
  )
);
