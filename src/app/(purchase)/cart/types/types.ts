// ✅ CartItem.ts or types.ts
export interface CartItem {
  id: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  // any other fields
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, action: "add" | "minus") => void;
  totalOfProduct: (id: string) => number;
  total: () => number;
  taxes: () => number;
  shipping: () => number;
}
