import { testUserId, baseItem } from "./cart";
import type { CartState } from "@/app/(purchase)/cart/types";

export const createMockCartState = (items = [baseItem]): CartState => ({
  byUser: { [testUserId]: items },
  addItem: jest.fn(),
  removeItem: jest.fn(),
  totalItems: jest.fn(),
  clearCart: jest.fn(),
  updateQuantity: jest.fn(),
  totalOfProduct: jest.fn(),
  subtotal: jest.fn(),
  taxes: jest.fn(),
  shipping: jest.fn(),
  total: jest.fn(),
});
