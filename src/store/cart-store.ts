import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useToastStore } from "./toastStore";
import type { CartItem, CartState } from "@/app/(purchase)/cart/types";

/**
 * @function
 * @returns {CartState} - A cart state instance.
 *
 * @example
 * const cartStore = useCartStore();
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      byUser: {},

      /**
       * @function
       * @param {number} userId - The user id.
       * @param {CartItem} item - The cart item.
       * @returns {void}
       *
       * @example
       * useCartStore.getState().addItem(1, { id: 1, size: 1 });
       */
      addItem: (userId, item: CartItem) => {
        const { byUser } = get();

        if (!userId) {
          useToastStore.getState().show({
            severity: "error",
            message: "You need to log in first",
          });

          return;
        }

        if (!item.size || item.size === 0) {
          useToastStore.getState().show({
            severity: "error",
            message: "Please select a size before adding to cart",
          });
          return;
        }

        const currentItems = byUser[userId] ?? [];

        //Search if any product in cart matches the one that is being added
        const itemAlreadyInCart = currentItems.find(
          (product) => product.id === item.id && product.size === item.size
        );

        //If product is already added to the cart we add 1 item to that existing element in cart
        if (itemAlreadyInCart) {
          set({
            byUser: {
              ...byUser,
              [userId]: currentItems.map((product) =>
                product.id === item.id && product.size === item.size
                  ? { ...product, quantity: (product.quantity || 1) + 1 }
                  : product
              ),
            },
          });

          useToastStore.getState().show({
            severity: "success",
            message: "Added item(s) to product existing in cart",
          });
        } else {
          //If product isn't already in cart we add it

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
        }
      },

      /**
       * @function
       * @param {number} userId - The user id.
       * @returns {number} - The total number of items in the cart.
       *
       * @example
       * const totalItems = useCartStore.getState().totalItems(1);
       */
      totalItems: (userId) => {
        return (get().byUser[userId] ?? []).reduce(
          (sum, item) => sum + (item.quantity || 1),
          0
        );
      },

      /**
       * @function
       * @param {number} userId - The user id.
       * @param {number} id - The product id.
       * @param {number} size - The product size.
       * @returns {void}
       *
       * @example
       * useCartStore.getState().removeItem(1, 1, 1);
       */
      removeItem: (userId, id, size) => {
        const { byUser } = get();

        set({
          byUser: {
            ...byUser,
            [userId]: (byUser[userId] ?? []).filter(
              (item) => !(item.id === id && item.size === size)
            ),
          },
        });
      },

      /**
       * @function
       * @param {number} userId - The user id.
       * @returns {void}
       *
       * @example
       * useCartStore.getState().clearCart(1);
       */
      clearCart: (userId) => {
        const { byUser } = get();
        set({ byUser: { ...byUser, [userId]: [] } });
      },

      /**
       * @function
       * @param {number} userId - The user id.
       * @param {number} id - The product id.
       * @param {string} action - The action to perform.
       * @param {number} size - The product size.
       * @returns {void}
       *
       * @example
       * useCartStore.getState().updateQuantity(1, 1, "add", 1);
       */
      updateQuantity: (userId, id, action, size) => {
        const { byUser } = get();
        const list = byUser[userId] ?? [];

        const updatedItems = list.map((item) => {
          //If product doesn't match id, we return it as it is
          if (item.id !== id || item.size !== size) return item;

          let newQuantity = item.quantity || 1;

          //If item matches id, we perform the correspondin action
          if (action === "add") {
            newQuantity++;
          } else if (action === "minus") {
            newQuantity--;
          }

          //Returns updated product. Minimum of 1 item
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        });

        //Update cart state
        set({ byUser: { ...byUser, [userId]: updatedItems } });
      },

      /**
       * @function
       * @param {number} userId - The user id.
       * @param {number} id - The product id.
       * @param {number} size - The product size.
       * @returns {number} - The total price of the product in the cart.
       *
       * @example
       * const totalPrice = useCartStore.getState().totalOfProduct(1, 1, 1);
       */
      totalOfProduct: (userId, id, size) => {
        //Find the item that matches the id
        const { byUser } = get();

        const list = byUser[userId] ?? [];

        const item = list.find(
          (product) => product.id === id && product.size === size
        );

        //If item exists, calculate total. If not, returns 0
        return item ? item.price * (item.quantity || 1) : 0;
      },

      /**
       * @function
       * @param {number} userId - The user id.
       * @returns {number} - The total price of all items in the cart.
       *
       * @example
       * const totalPrice = useCartStore.getState().subtotal(1);
       */
      subtotal: (userId) => {
        // Use totalOfProduct for each item to calculate total
        return (get().byUser[userId] ?? []).reduce(
          (sum, item) => sum + item.price * (item.quantity || 1),
          0
        );
      },

      /**
       * @function
       * @param {number} userId - The user id.
       * @returns {number} - The total price of all items in the cart.
       *
       * @example
       * const totalPrice = useCartStore.getState().taxes(1);
       */
      taxes: (userId) => {
        const taxRate = 0.1; //10%
        return Math.round(get().subtotal(userId) * taxRate);
      },

      /**
       * @function
       * @param {number} userId - The user id.
       * @returns {number} - The total price of all items in the cart.
       *
       * @example
       * const totalPrice = useCartStore.getState().shipping(1);
       */
      shipping: (userId) => {
        const minimumFreeShipping = 100;
        const shippingCost = 10;
        const subtotal = get().subtotal(userId);

        return subtotal > minimumFreeShipping ? 0 : shippingCost;
      },

      /**
       * @function
       * @param {number} userId - The user id.
       * @returns {number} - The total price of all items in the cart.
       *
       * @example
       * const totalPrice = useCartStore.getState().total(1);
       */
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
