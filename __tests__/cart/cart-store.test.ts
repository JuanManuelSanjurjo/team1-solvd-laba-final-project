const showMock = jest.fn();
jest.mock("@/store/toastStore", () => ({
  useToastStore: {
    getState: () => ({
      show: showMock,
    }),
  },
}));

import { act } from "@testing-library/react";
import { useCartStore } from "@/store/cart-store";

const baseItem = {
  id: 456,
  name: "Shoe",
  price: 50,
  image: "shoe.jpg",
  gender: "Woman",
  size: 42,
  quantity: 1,
};

beforeEach(() => {
  useCartStore.setState({ byUser: {} });
  showMock.mockClear();
});

/* Add Item */
describe("useCartStore - addItem", () => {
  const userId = "user123";

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

    // 👟 Primera vez → agrega el item
    act(() => {
      addItem(userId, baseItem);
    });

    let state = useCartStore.getState();
    expect(state.byUser[userId][0].quantity).toBe(1);

    // 👟 Segunda vez → debería sumar +1 (quedar en 2)
    act(() => {
      addItem(userId, baseItem);
    });

    state = useCartStore.getState();
    expect(state.byUser[userId][0].quantity).toBe(2);
  });
});

/* Remove Item */
describe("useCartStore - removeItem", () => {
  const userId = "user123";

  test("should remove item from cart", () => {
    const { addItem, removeItem } = useCartStore.getState();

    act(() => {
      addItem(userId, baseItem);
    });

    let state = useCartStore.getState();
    expect(state.byUser[userId]).toHaveLength(1);

    act(() => {
      removeItem(userId, 456, 42);
    });

    state = useCartStore.getState();
    expect(state.byUser[userId]).toEqual([]);
  });

  test("should do nothing if item id does not exist", () => {
    const { addItem, removeItem } = useCartStore.getState();

    act(() => {
      addItem(userId, baseItem); // agregamos
    });

    let state = useCartStore.getState();
    expect(state.byUser[userId]).toHaveLength(1);

    act(() => {
      removeItem(userId, 999, 42); // id distinto
    });

    state = useCartStore.getState();
    expect(state.byUser[userId]).toHaveLength(1); // sigue igual
  });

  test("should do nothing if cart is empty", () => {
    const { removeItem } = useCartStore.getState();

    act(() => {
      removeItem(userId, 456, 42); // carrito vacío
    });

    const state = useCartStore.getState();
    expect(state.byUser[userId]).toEqual([]); // 👈 esperamos array vacío
  });
});

describe("useCartStore - clearCart", () => {
  const userId = "user123";

  test("should clear all items from the cart", () => {
    const { addItem, clearCart } = useCartStore.getState();

    act(() => {
      addItem(userId, baseItem);
      addItem(userId, { ...baseItem, size: 43 });
    });

    let state = useCartStore.getState();
    expect(state.byUser[userId]).toHaveLength(2);

    act(() => {
      clearCart(userId);
    });

    state = useCartStore.getState();
    expect(state.byUser[userId]).toEqual([]);
  });

  test("should leave cart as empty array if it was already empty", () => {
    const { clearCart } = useCartStore.getState();

    act(() => {
      clearCart(userId);
    });

    const state = useCartStore.getState();
    expect(state.byUser[userId]).toEqual([]);
  });
});

describe("useCartStore - updateQuantity", () => {
  const userId = "user123";

  test("should increment quantity when action is add", () => {
    const { addItem, updateQuantity } = useCartStore.getState();

    act(() => {
      addItem(userId, baseItem);
    });

    let state = useCartStore.getState();
    expect(state.byUser[userId][0].quantity).toBe(1);

    act(() => {
      updateQuantity(userId, 456, "add", 42);
    });

    state = useCartStore.getState();
    expect(state.byUser[userId][0].quantity).toBe(2);
  });

  test("should decrement quantity when action is minus", () => {
    const { addItem, updateQuantity } = useCartStore.getState();

    act(() => {
      addItem(userId, baseItem);
      updateQuantity(userId, 456, "add", 42); // Quantity: 2
    });

    let state = useCartStore.getState();
    expect(state.byUser[userId][0].quantity).toBe(2);

    act(() => {
      updateQuantity(userId, 456, "minus", 42);
    });

    state = useCartStore.getState();
    expect(state.byUser[userId][0].quantity).toBe(1);
  });

  test("should not reduce quantity below 1", () => {
    const { addItem, updateQuantity } = useCartStore.getState();

    act(() => {
      addItem(userId, baseItem); // Quantity: 1
    });

    act(() => {
      updateQuantity(userId, 456, "minus", 42); //Try minus if quantity is 1
    });

    const state = useCartStore.getState();
    expect(state.byUser[userId][0].quantity).toBe(1); //Expect it to be 1
  });

  test("should do nothing if item does not exist", () => {
    const { addItem, updateQuantity } = useCartStore.getState();

    act(() => {
      addItem(userId, baseItem);
    });

    act(() => {
      updateQuantity(userId, 999, "add", 42);
    });

    const state = useCartStore.getState();
    expect(state.byUser[userId][0].quantity).toBe(1);
  });
});

describe("useCartStore - totalOfProduct", () => {
  const userId = "user123";

  test("should return price * quantity when item exists", () => {
    const { addItem, updateQuantity, totalOfProduct } = useCartStore.getState();

    act(() => {
      addItem(userId, baseItem); // quantity = 1
      updateQuantity(userId, 456, "add", 42); // quantity = 2
    });

    const total = totalOfProduct(userId, 456, 42);
    expect(total).toBe(100); // 50 * 2
  });

  test("should return 0 if product does not exist", () => {
    const { totalOfProduct } = useCartStore.getState();

    const total = totalOfProduct(userId, 999, 42);
    expect(total).toBe(0);
  });

  test("should use default quantity = 1 if not set", () => {
    const { addItem, totalOfProduct } = useCartStore.getState();

    act(() => {
      addItem(userId, { ...baseItem }); // addItem always begins in 1
    });

    const total = totalOfProduct(userId, 456, 42);
    expect(total).toBe(50); // price * 1
  });
});

describe("useCartStore - subtotal", () => {
  const userId = "user123";

  test("should return 0 if cart is empty", () => {
    const { subtotal } = useCartStore.getState();

    const total = subtotal(userId);
    expect(total).toBe(0);
  });

  test("should return price * quantity for a single item", () => {
    const { addItem, updateQuantity, subtotal } = useCartStore.getState();

    act(() => {
      addItem(userId, baseItem); // quantity = 1
      updateQuantity(userId, 456, "add", 42); // quantity = 2
    });

    const total = subtotal(userId);
    expect(total).toBe(100); // 50 * 2
  });

  test("should sum multiple products", () => {
    const { addItem, updateQuantity, subtotal } = useCartStore.getState();

    act(() => {
      addItem(userId, baseItem); // item1: 50 * 1
      addItem(userId, { ...baseItem, id: 789, price: 30, size: 43 }); // item2: 30 * 1
      updateQuantity(userId, 789, "add", 43); // item2: 30 * 2
      updateQuantity(userId, 789, "add", 43); // item2: 30 * 3
    });

    const total = subtotal(userId);
    expect(total).toBe(140); // 50*1 + 30*3
  });
});

describe("useCartStore - taxes", () => {
  const userId = "user123";

  test("should return 0 if cart is empty", () => {
    const { taxes } = useCartStore.getState();

    const totalTaxes = taxes(userId);
    expect(totalTaxes).toBe(0);
  });

  test("should return 10% of subtotal when subtotal is multiple of 10", () => {
    const { addItem, subtotal, taxes } = useCartStore.getState();

    act(() => {
      addItem(userId, baseItem); // subtotal = 50
      addItem(userId, { ...baseItem, id: 789, price: 50, size: 43 }); // adding other product: subtotal = 100
    });

    const sub = subtotal(userId);
    expect(sub).toBe(100);

    const totalTaxes = taxes(userId);
    expect(totalTaxes).toBe(10);
  });

  test("should round tax calculation", () => {
    const { addItem, subtotal, taxes } = useCartStore.getState();

    act(() => {
      addItem(userId, { ...baseItem, price: 55 }); // subtotal = 55
    });

    const sub = subtotal(userId);
    expect(sub).toBe(55);

    const totalTaxes = taxes(userId);
    expect(totalTaxes).toBe(6); // 55 * 0.1 = 5.5 → round = 6
  });
});

describe("useCartStore - shipping", () => {
  const userId = "user123";

  test("should return 10 if cart is empty", () => {
    const { shipping } = useCartStore.getState();

    const ship = shipping(userId);
    expect(ship).toBe(10);
  });

  test("should return 10 if subtotal is below 100", () => {
    const { addItem, shipping } = useCartStore.getState();

    act(() => {
      addItem(userId, baseItem); // subtotal = 50
    });

    const ship = shipping(userId);
    expect(ship).toBe(10);
  });

  test("should return 10 if subtotal is exactly 100", () => {
    const { addItem, shipping } = useCartStore.getState();

    act(() => {
      addItem(userId, baseItem); // 50
      addItem(userId, { ...baseItem, id: 789, size: 43, price: 50 }); // adding other product:  +50 = 100
    });

    const ship = shipping(userId);
    expect(ship).toBe(10);
  });

  test("should return 0 if subtotal is greater than 100", () => {
    const { addItem, shipping } = useCartStore.getState();

    act(() => {
      addItem(userId, { ...baseItem, price: 120 }); // subtotal = 120
    });

    const ship = shipping(userId);
    expect(ship).toBe(0);
  });
});

describe("useCartStore - total", () => {
  const userId = "user123";

  test("should return 10 if cart is empty (only shipping)", () => {
    const { total } = useCartStore.getState();

    const result = total(userId);
    expect(result).toBe(10); // 0 + 0 + 10
  });

  test("should include subtotal, taxes, and shipping correctly at subtotal = 100", () => {
    const { addItem, total } = useCartStore.getState();

    act(() => {
      addItem(userId, baseItem); // 50
      addItem(userId, { ...baseItem, id: 789, size: 43, price: 50 }); // +50 = 100
    });

    const result = total(userId);
    expect(result).toBe(120); // subtotal 100 + taxes 10 + shipping 10
  });

  test("should calculate correctly when subtotal > 100 (free shipping)", () => {
    const { addItem, total } = useCartStore.getState();

    act(() => {
      addItem(userId, { ...baseItem, price: 120 }); // subtotal = 120
    });

    const result = total(userId);
    expect(result).toBe(132); // subtotal 120 + taxes 12 + shipping 0
  });
});

//Toast
describe("useCartStore + toast integration", () => {
  const userId = "user123";

  test("should show error toast when adding item with no userId", () => {
    const { addItem } = useCartStore.getState();

    act(() => {
      addItem("", baseItem);
    });

    expect(showMock).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "error" })
    );
  });

  test("should show error toast when adding item without size", () => {
    const { addItem } = useCartStore.getState();

    act(() => {
      addItem(userId, { ...baseItem, size: 0 });
    });

    expect(showMock).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "error" })
    );
  });

  test("should show success toast when adding new item", () => {
    const { addItem } = useCartStore.getState();

    act(() => {
      addItem(userId, baseItem);
    });

    expect(showMock).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "success" })
    );
  });

  test("should show success toast when incrementing quantity of existing item", () => {
    const { addItem } = useCartStore.getState();

    act(() => {
      addItem(userId, baseItem); //First time
      addItem(userId, baseItem); // Second time
    });

    expect(showMock).toHaveBeenCalledTimes(2);
    expect(showMock).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "success" })
    );
  });
});
