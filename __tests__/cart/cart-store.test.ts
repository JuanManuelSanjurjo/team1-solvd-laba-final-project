/* // Mock: Toast Store
jest.mock("@/store/toastStore", () => ({
  useToastStore: {
    getState: () => ({
      show: jest.fn(),
    }),
  },
}));

// Reset
beforeEach(() => {
  useCartStore.setState({ byUser: {} });
  showMock.mockClear();
}); */

import { act } from "@testing-library/react";
import { useCartStore } from "@/store/cart-store";

// const showMock = jest.fn();

describe("useCartStore - addItem", () => {
  const userId = "user123";

  const baseItem = {
    id: 456,
    name: "Shoe",
    price: 50,
    image: "shoe.jpg",
    gender: "Woman",
    size: 42,
    quantity: 1,
  };

  test("should not add item if no userId", () => {
    const { addItem, byUser } = useCartStore.getState();

    act(() => {
      addItem("", baseItem);
    });

    expect(byUser[""]).toBeUndefined();
  });

  test("should not add item if size is missing", () => {
    const { addItem, byUser } = useCartStore.getState();

    act(() => {
      addItem(userId, { ...baseItem, size: 0 });
    });

    expect(byUser[userId]).toBeUndefined();
  });

  test("should add new item to cart", () => {
    const { addItem } = useCartStore.getState();

    act(() => {
      addItem(userId, baseItem);
    });

    // Leemos el estado actualizado después de act()
    const state = useCartStore.getState();
    expect(state.byUser[userId]).toHaveLength(1);
    expect(state.byUser[userId][0].id).toBe(456);

    /* expect(showMock).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "success" })
    ); */
  });

  test("should increment quantity if same item+size is added again", () => {
    const { addItem } = useCartStore.getState();

    act(() => {
      addItem(userId, baseItem);
      addItem(userId, baseItem);
    });

    const state = useCartStore.getState();
    expect(state.byUser[userId][0].quantity).toBe(2);
    // expect(showMock).toHaveBeenCalledTimes(2);
  });
});
