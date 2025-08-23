import { useWishlistStore } from "@/store/wishlist-store";
import {
  MOCK_CARD_PRODUCT,
  MOCK_CARD_PRODUCT_2,
  MOCK_USER_ID,
  MOCK_USER_ID_2,
} from "__tests__/mocks/shared/mock-product-card";
import CardProduct from "@/components/cards/actions/types";

const STORAGE_KEY = "wishlist-storage-v2";

const checkLocalStorage = (expectedWishlist: CardProduct[]) => {
  const raw = localStorage.getItem(STORAGE_KEY);
  expect(raw).toBeTruthy();
  const storedData = JSON.parse(raw as string);
  const list = (storedData?.state?.byUser?.[MOCK_USER_ID] ??
    []) as CardProduct[];
  expect(list).toEqual(expectedWishlist);
};

const checkLocalStorageFor = (userId: string, expected: CardProduct[]) => {
  const raw = localStorage.getItem(STORAGE_KEY);
  expect(raw).toBeTruthy();

  const data = JSON.parse(raw as string);
  const list = data?.state?.byUser?.[userId] ?? [];
  expect(list).toEqual(expected);
};

beforeEach(() => {
  localStorage.clear();
  useWishlistStore.setState({ byUser: {} });
});

describe("WishlistStore", () => {
  it("should add a product to the wishlist and save to localStorage", () => {
    useWishlistStore.getState().addToWishList(MOCK_USER_ID, MOCK_CARD_PRODUCT);

    const storeState = useWishlistStore.getState();

    expect(storeState.byUser[MOCK_USER_ID]).toEqual([MOCK_CARD_PRODUCT]);
    checkLocalStorage([MOCK_CARD_PRODUCT]);
  });

  it("should remove a product from the wishlist and update localStorage", () => {
    useWishlistStore.setState({
      byUser: { [MOCK_USER_ID]: [MOCK_CARD_PRODUCT] },
    });

    useWishlistStore
      .getState()
      .removeFromWishList(MOCK_USER_ID, MOCK_CARD_PRODUCT.id);

    const storeState = useWishlistStore.getState();

    expect(storeState.byUser[MOCK_USER_ID]).toEqual([]);
    checkLocalStorage([]);
  });

  it("removeFromWishList: early return when user has no list", () => {
    const before = localStorage.getItem(STORAGE_KEY);
    useWishlistStore.setState({ byUser: {} });

    useWishlistStore.getState().removeFromWishList(MOCK_USER_ID, 123);

    expect(useWishlistStore.getState().byUser[MOCK_USER_ID]).toBeUndefined();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  });

  it("should clear the wishlist and update localStorage", () => {
    useWishlistStore.setState({
      byUser: { [MOCK_USER_ID]: [MOCK_CARD_PRODUCT, MOCK_CARD_PRODUCT_2] },
    });

    useWishlistStore.getState().clearWishList(MOCK_USER_ID);

    const storeState = useWishlistStore.getState();

    expect(storeState.byUser[MOCK_USER_ID]).toEqual([]);
    checkLocalStorage([]);
  });

  it("clearWishList: early return when user has no list", () => {
    const before = localStorage.getItem(STORAGE_KEY);
    useWishlistStore.setState({ byUser: {} });

    useWishlistStore.getState().clearWishList(MOCK_USER_ID);

    expect(useWishlistStore.getState().byUser[MOCK_USER_ID]).toBeUndefined();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  });

  it("should not add to wishlist an existent product", () => {
    useWishlistStore.setState({
      byUser: { [MOCK_USER_ID]: [MOCK_CARD_PRODUCT] },
    });

    useWishlistStore.getState().addToWishList(MOCK_USER_ID, MOCK_CARD_PRODUCT);

    const storeState = useWishlistStore.getState();

    expect(storeState.byUser[MOCK_USER_ID]).toEqual([MOCK_CARD_PRODUCT]);
    checkLocalStorage([MOCK_CARD_PRODUCT]);
  });

  it("should add a product if it is not existent", () => {
    const anotherMockProduct = { ...MOCK_CARD_PRODUCT, id: 456 };
    useWishlistStore.setState({
      byUser: { [MOCK_USER_ID]: [MOCK_CARD_PRODUCT] },
    });

    useWishlistStore.getState().addToWishList(MOCK_USER_ID, anotherMockProduct);

    const storeState = useWishlistStore.getState();

    expect(storeState.byUser[MOCK_USER_ID]).toEqual([
      MOCK_CARD_PRODUCT,
      anotherMockProduct,
    ]);
    checkLocalStorage([MOCK_CARD_PRODUCT, anotherMockProduct]);
  });

  it("should remove inactive products by id for the user", () => {
    const anotherMockProduct = { ...MOCK_CARD_PRODUCT, id: 999 };

    useWishlistStore.setState({
      byUser: {
        [MOCK_USER_ID]: [
          MOCK_CARD_PRODUCT,
          MOCK_CARD_PRODUCT_2,
          anotherMockProduct,
        ],
      },
    });

    useWishlistStore
      .getState()
      .removeInactiveProducts(MOCK_USER_ID, [
        MOCK_CARD_PRODUCT.id,
        anotherMockProduct.id,
      ]);

    const { byUser } = useWishlistStore.getState();
    expect(byUser[MOCK_USER_ID]).toEqual([MOCK_CARD_PRODUCT_2]);

    checkLocalStorage([MOCK_CARD_PRODUCT_2]);
  });

  it("removeInactiveProducts: early return when user has no list", () => {
    const before = localStorage.getItem(STORAGE_KEY);
    useWishlistStore.setState({ byUser: {} });

    useWishlistStore
      .getState()
      .removeInactiveProducts(MOCK_USER_ID, [MOCK_CARD_PRODUCT.id]);

    expect(useWishlistStore.getState().byUser[MOCK_USER_ID]).toBeUndefined();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  });

  it("removeInactiveProducts: early return when ids=[] and user has a list", () => {
    useWishlistStore.setState({
      byUser: { [MOCK_USER_ID]: [MOCK_CARD_PRODUCT, MOCK_CARD_PRODUCT_2] },
    });

    useWishlistStore.getState().removeInactiveProducts(MOCK_USER_ID, []);

    expect(useWishlistStore.getState().byUser[MOCK_USER_ID]).toEqual([
      MOCK_CARD_PRODUCT,
      MOCK_CARD_PRODUCT_2,
    ]);
    checkLocalStorage([MOCK_CARD_PRODUCT, MOCK_CARD_PRODUCT_2]);
  });

  it("should not affect other users' lists", () => {
    const anotherMockProduct = { ...MOCK_CARD_PRODUCT, id: 777 };

    useWishlistStore.setState({
      byUser: {
        [MOCK_USER_ID]: [MOCK_CARD_PRODUCT],
        [MOCK_USER_ID_2]: [MOCK_CARD_PRODUCT_2],
      },
    });

    useWishlistStore.getState().addToWishList(MOCK_USER_ID, anotherMockProduct);

    const { byUser } = useWishlistStore.getState();
    expect(byUser[MOCK_USER_ID]).toEqual([
      MOCK_CARD_PRODUCT,
      anotherMockProduct,
    ]);
    expect(byUser[MOCK_USER_ID_2]).toEqual([MOCK_CARD_PRODUCT_2]);

    checkLocalStorage([MOCK_CARD_PRODUCT, anotherMockProduct]);
    checkLocalStorageFor(MOCK_USER_ID_2, [MOCK_CARD_PRODUCT_2]);
  });
});
