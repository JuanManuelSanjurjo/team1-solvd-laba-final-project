export type OrderProduct = {
  imageUrl: string;
  name: string;
  description: string;
  size: string;
  quantity: number;
  price: string;
};

export type OrderDetails = {
  delivery: string;
  contacts: string;
  payment: string;
  discount: string;
};

export type OrderInfo = {
  orderNumber: string;
  orderDate: string;
  productCount: number;
  totalAmount: string;
  status: OrderStatus;
};

export type OrderStatus = "succeeded" | "pending" | "failed";
