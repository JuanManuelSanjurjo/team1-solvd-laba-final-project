import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem, CartState } from "@/app/(purchase)/cart/types/types";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        const currentItems = get().items;

        //Search if any product in cart matches the one that is being added
        const itemAlreadyInCart = currentItems.find(
          (product) => product.id === item.id
        );

        //If product is already added to the cart we add 1 item to that existing element in cart
        if (itemAlreadyInCart) {
          set({
            items: currentItems.map((product) =>
              product.id === item.id
                ? { ...product, quantity: (product.quantity || 1) + 1 }
                : product
            ),
          });
          //If product isn't already in cart we add it
          console.log("Added item to product existing in cart", currentItems);
        } else {
          set({ items: [...currentItems, { ...item, quantity: 1 }] });
          console.log("Added item to cart", currentItems);
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      clearCart: () => {
        set({ items: [] });
      },

      updateQuantity: (id, action) => {
        const updatedItems = get().items.map((item) => {
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
        set({ items: updatedItems });
      },

      totalOfProduct: (id) => {
        //Find the item that matches the id
        const item = get().items.find((product) => product.id === id);

        //If item exists, calculate total. If not, returns 0
        return item ? item.price * (item.quantity || 1) : 0;
      },

      total: () => {
        // Use totalOfProduct for each item to calculate total
        return get().items.reduce((sum, item) => {
          return sum + get().totalOfProduct(item.id);
        }, 0);
      },

      taxes: () => {
        const taxRate = 0.1; // 10%
        return get().total() * taxRate;
      },

      shipping: () => {
        const minimumFreeShipping = 100;
        const shippingCost = 10;
        const total = get().total();

        if (total > minimumFreeShipping) {
          return 0;
        } else {
          return shippingCost;
        }
      },
    }),
    {
      name: "cart-storage", // clave en localStorage
    }
  )
);
