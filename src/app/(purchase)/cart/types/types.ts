export interface CartItem {
  id: number;
  image: string | undefined;
  name: string;
  price: number;
  quantity: number;
  gender: string | undefined;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  updateQuantity: (id: number, action: "add" | "minus") => void;
  totalOfProduct: (id: number) => number;
  total: () => number;
  taxes: () => number;
  shipping: () => number;
}
