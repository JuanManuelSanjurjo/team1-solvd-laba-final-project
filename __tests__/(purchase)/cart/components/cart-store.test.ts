// Mocks
const showMock = jest.fn();
jest.mock("@/store/toastStore", () => ({
  useToastStore: {
    getState: () => ({
      show: showMock,
    }),
  },
}));

// Imports
import { act } from "@testing-library/react";
import { useCartStore } from "@/store/cart-store";
import { baseItem, testUserId } from "__tests__/(purchase)/test-utils/cart";

// Mocks
beforeEach(() => {
  useCartStore.setState({ byUser: {} });
  showMock.mockClear();
});

/* Add Item */
describe("useCartStore - addItem", () => {
  it("should not add item if no userId", () => {
    const { addItem, byUser } = useCartStore.getState();

    act(() => {
      addItem("", baseItem);
    });

    expect(byUser[""]).toBeUndefined();
  });

  it("should not add item if size is missing", () => {
    const { addItem, byUser } = useCartStore.getState();

    act(() => {
      addItem(testUserId, { ...baseItem, size: 0 });
    });

    expect(byUser[testUserId]).toBeUndefined();
  });

  it("should add new item to cart", () => {
    const { addItem } = useCartStore.getState();

    act(() => {
      addItem(testUserId, baseItem);
    });

    const state = useCartStore.getState();
    expect(state.byUser[testUserId]).toHaveLength(1);
    expect(state.byUser[testUserId][0].id).toBe(456);
  });

  it("should increment quantity if same item+size is added again", () => {
    const { addItem } = useCartStore.getState();

    act(() => {
      addItem(testUserId, baseItem);
    });

    let state = useCartStore.getState();
    expect(state.byUser[testUserId][0].quantity).toBe(1);

    act(() => {
      addItem(testUserId, baseItem);
    });

    state = useCartStore.getState();
    expect(state.byUser[testUserId][0].quantity).toBe(2);
  });
});

/* Remove Item */
describe("useCartStore - removeItem", () => {
  it("should remove item from cart", () => {
    const { addItem, removeItem } = useCartStore.getState();

    act(() => {
      addItem(testUserId, baseItem);
    });

    let state = useCartStore.getState();
    expect(state.byUser[testUserId]).toHaveLength(1);

    act(() => {
      removeItem(testUserId, 456, 42);
    });

    state = useCartStore.getState();
    expect(state.byUser[testUserId]).toEqual([]);
  });

  it("should do nothing if item id does not exist", () => {
    const { addItem, removeItem } = useCartStore.getState();

    act(() => {
      addItem(testUserId, baseItem);
    });

    let state = useCartStore.getState();
    expect(state.byUser[testUserId]).toHaveLength(1);

    act(() => {
      removeItem(testUserId, 999, 42);
    });

    state = useCartStore.getState();
    expect(state.byUser[testUserId]).toHaveLength(1);
  });

  it("should do nothing if cart is empty", () => {
    const { removeItem } = useCartStore.getState();

    act(() => {
      removeItem(testUserId, 456, 42);
    });

    const state = useCartStore.getState();
    expect(state.byUser[testUserId]).toEqual([]); //
  });
});

/* Clear cart */
describe("useCartStore - clearCart", () => {
  it("should clear all items from the cart", () => {
    const { addItem, clearCart } = useCartStore.getState();

    act(() => {
      addItem(testUserId, baseItem);
      addItem(testUserId, { ...baseItem, size: 43 });
    });

    let state = useCartStore.getState();
    expect(state.byUser[testUserId]).toHaveLength(2);

    act(() => {
      clearCart(testUserId);
    });

    state = useCartStore.getState();
    expect(state.byUser[testUserId]).toEqual([]);
  });

  it("should leave cart as empty array if it was already empty", () => {
    const { clearCart } = useCartStore.getState();

    act(() => {
      clearCart(testUserId);
    });

    const state = useCartStore.getState();
    expect(state.byUser[testUserId]).toEqual([]);
  });
});

/* Update quantity */
describe("useCartStore - updateQuantity", () => {
  it("should increment quantity when action is add", () => {
    const { addItem, updateQuantity } = useCartStore.getState();

    act(() => {
      addItem(testUserId, baseItem);
    });

    let state = useCartStore.getState();
    expect(state.byUser[testUserId][0].quantity).toBe(1);

    act(() => {
      updateQuantity(testUserId, 456, "add", 42);
    });

    state = useCartStore.getState();
    expect(state.byUser[testUserId][0].quantity).toBe(2);
  });

  it("should decrement quantity when action is minus", () => {
    const { addItem, updateQuantity } = useCartStore.getState();

    act(() => {
      addItem(testUserId, baseItem);
      updateQuantity(testUserId, 456, "add", 42);
    });

    let state = useCartStore.getState();
    expect(state.byUser[testUserId][0].quantity).toBe(2);

    act(() => {
      updateQuantity(testUserId, 456, "minus", 42);
    });

    state = useCartStore.getState();
    expect(state.byUser[testUserId][0].quantity).toBe(1);
  });

  it("should not reduce quantity below 1", () => {
    const { addItem, updateQuantity } = useCartStore.getState();

    act(() => {
      addItem(testUserId, baseItem);
    });

    act(() => {
      updateQuantity(testUserId, 456, "minus", 42);
    });

    const state = useCartStore.getState();
    expect(state.byUser[testUserId][0].quantity).toBe(1);
  });

  it("should do nothing if item does not exist", () => {
    const { addItem, updateQuantity } = useCartStore.getState();

    act(() => {
      addItem(testUserId, baseItem);
    });

    act(() => {
      updateQuantity(testUserId, 999, "add", 42);
    });

    const state = useCartStore.getState();
    expect(state.byUser[testUserId][0].quantity).toBe(1);
  });
});

/* Calculate total of product */
describe("useCartStore - totalOfProduct", () => {
  it("should return price * quantity when item exists", () => {
    const { addItem, updateQuantity, totalOfProduct } = useCartStore.getState();

    act(() => {
      addItem(testUserId, baseItem); // quantity = 1
      updateQuantity(testUserId, 456, "add", 42);
    });

    const total = totalOfProduct(testUserId, 456, 42);
    expect(total).toBe(100); // 50 * 2
  });

  it("should return 0 if product does not exist", () => {
    const { totalOfProduct } = useCartStore.getState();

    const total = totalOfProduct(testUserId, 999, 42);
    expect(total).toBe(0);
  });

  it("should use default quantity = 1 if not set", () => {
    const { addItem, totalOfProduct } = useCartStore.getState();

    act(() => {
      addItem(testUserId, { ...baseItem });
    });

    const total = totalOfProduct(testUserId, 456, 42);
    expect(total).toBe(50);
  });
});

/* Calculate subtotal of whole cart */
describe("useCartStore - subtotal", () => {
  it("should return 0 if cart is empty", () => {
    const { subtotal } = useCartStore.getState();

    const total = subtotal(testUserId);
    expect(total).toBe(0);
  });

  it("should return price * quantity for a single item", () => {
    const { addItem, updateQuantity, subtotal } = useCartStore.getState();

    act(() => {
      addItem(testUserId, baseItem);
      updateQuantity(testUserId, 456, "add", 42);
    });

    const total = subtotal(testUserId);
    expect(total).toBe(100);
  });

  it("should sum multiple products", () => {
    const { addItem, updateQuantity, subtotal } = useCartStore.getState();

    act(() => {
      addItem(testUserId, baseItem);
      addItem(testUserId, { ...baseItem, id: 789, price: 30, size: 43 });
      updateQuantity(testUserId, 789, "add", 43);
      updateQuantity(testUserId, 789, "add", 43);
    });

    const total = subtotal(testUserId);
    expect(total).toBe(140);
  });
});

/* Calculate taxes */
describe("useCartStore - taxes", () => {
  it("should return 0 if cart is empty", () => {
    const { taxes } = useCartStore.getState();

    const totalTaxes = taxes(testUserId);
    expect(totalTaxes).toBe(0);
  });

  it("should return 10% of subtotal when subtotal is multiple of 10", () => {
    const { addItem, subtotal, taxes } = useCartStore.getState();

    act(() => {
      addItem(testUserId, baseItem); // subtotal = 50
      addItem(testUserId, { ...baseItem, id: 789, price: 50, size: 43 }); // adding other product: subtotal = 100
    });

    const sub = subtotal(testUserId);
    expect(sub).toBe(100);

    const totalTaxes = taxes(testUserId);
    expect(totalTaxes).toBe(10);
  });

  it("should round tax calculation", () => {
    const { addItem, subtotal, taxes } = useCartStore.getState();

    act(() => {
      addItem(testUserId, { ...baseItem, price: 55 }); // subtotal = 55
    });

    const sub = subtotal(testUserId);
    expect(sub).toBe(55);

    const totalTaxes = taxes(testUserId);
    expect(totalTaxes).toBe(6);
  });
});

/* Calculate shipping */
describe("useCartStore - shipping", () => {
  it("should return 10 if cart is empty", () => {
    const { shipping } = useCartStore.getState();

    const ship = shipping(testUserId);
    expect(ship).toBe(10);
  });

  it("should return 10 if subtotal is below 100", () => {
    const { addItem, shipping } = useCartStore.getState();

    act(() => {
      addItem(testUserId, baseItem);
    });

    const ship = shipping(testUserId);
    expect(ship).toBe(10);
  });

  it("should return 10 if subtotal is exactly 100", () => {
    const { addItem, shipping } = useCartStore.getState();

    act(() => {
      addItem(testUserId, baseItem);
      addItem(testUserId, { ...baseItem, id: 789, size: 43, price: 50 });
    });

    const ship = shipping(testUserId);
    expect(ship).toBe(10);
  });

  it("should return 0 if subtotal is greater than 100", () => {
    const { addItem, shipping } = useCartStore.getState();

    act(() => {
      addItem(testUserId, { ...baseItem, price: 120 }); // subtotal = 120
    });

    const ship = shipping(testUserId);
    expect(ship).toBe(0);
  });
});

/* Calculate total to pay */
describe("useCartStore - total", () => {
  it("should return 10 if cart is empty (only shipping)", () => {
    const { total } = useCartStore.getState();

    const result = total(testUserId);
    expect(result).toBe(10);
  });

  it("should include subtotal, taxes, and shipping correctly at subtotal = 100", () => {
    const { addItem, total } = useCartStore.getState();

    act(() => {
      addItem(testUserId, baseItem);
      addItem(testUserId, { ...baseItem, id: 789, size: 43, price: 50 });
    });

    const result = total(testUserId);
    expect(result).toBe(120);
  });

  it("should calculate correctly when subtotal > 100 (free shipping)", () => {
    const { addItem, total } = useCartStore.getState();

    act(() => {
      addItem(testUserId, { ...baseItem, price: 120 });
    });

    const result = total(testUserId);
    expect(result).toBe(132);
  });
});

//Toast
describe("useCartStore + toast integration", () => {
  it("should show error toast when adding item with no userId", () => {
    const { addItem } = useCartStore.getState();

    act(() => {
      addItem("", baseItem);
    });

    expect(showMock).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "error" })
    );
  });

  it("should show error toast when adding item without size", () => {
    const { addItem } = useCartStore.getState();

    act(() => {
      addItem(testUserId, { ...baseItem, size: 0 });
    });

    expect(showMock).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "error" })
    );
  });

  it("should show success toast when adding new item", () => {
    const { addItem } = useCartStore.getState();

    act(() => {
      addItem(testUserId, baseItem);
    });

    expect(showMock).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "success" })
    );
  });

  it("should show success toast when incrementing quantity of existing item", () => {
    const { addItem } = useCartStore.getState();

    act(() => {
      addItem(testUserId, baseItem); //First time
      addItem(testUserId, baseItem); // Second time
    });

    expect(showMock).toHaveBeenCalledTimes(2);
    expect(showMock).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "success" })
    );
  });
});
