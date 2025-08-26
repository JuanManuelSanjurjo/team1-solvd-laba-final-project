export interface CartItem {
  id: number;
  image: string | undefined;
  name: string;
  price: number;
  size: number | null;
  gender: string | undefined;
  quantity: number;
}

export interface CartState {
  byUser: Record<string, CartItem[]>;
  addItem: (userId: string, item: CartItem) => void;
  removeItem: (userId: string, id: number, size: number) => void;
  totalItems: (userId: string) => number;
  clearCart: (userId: string) => void;
  updateQuantity: (
    userId: string,
    id: number,
    action: "add" | "minus",
    size: number
  ) => void;
  totalOfProduct: (userId: string, id: number, size: number) => number;
  subtotal: (userId: string) => number;
  taxes: (userId: string) => number;
  shipping: (userId: string) => number;
  total: (userId: string) => number;
}
