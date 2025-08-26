import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import CardProduct from "@/components/cards/actions/types";
import {
  MOCK_CARD_PRODUCT,
  MOCK_CARD_PRODUCT_2,
  MOCK_ARRAY_CARD_PRODUCT,
  MOCK_USER_ID,
  MOCK_USER_ID_2,
} from "__tests__/mocks/shared/mock-product-card";

const STORAGE_KEY = "recently-viewed-products-v2";

const checkLocalStorage = (expectedRecentlyViewed: CardProduct[]) => {
  const raw = localStorage.getItem(STORAGE_KEY);
  expect(raw).toBeTruthy();

  const storedData = JSON.parse(raw as string);
  const list = (storedData?.state?.byUser?.[MOCK_USER_ID] ??
    []) as CardProduct[];
  expect(list).toEqual(expectedRecentlyViewed);
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
  useRecentlyViewedStore.setState({ byUser: {}, max: 10 });
});

describe("RecentlyViewedStore", () => {
  it("should add a product to the recentlyViewed and save to localStorage", () => {
    useRecentlyViewedStore
      .getState()
      .addToRecentlyViewed(MOCK_USER_ID, MOCK_CARD_PRODUCT);

    const storeState = useRecentlyViewedStore.getState();

    expect(storeState.byUser[MOCK_USER_ID]).toEqual([MOCK_CARD_PRODUCT]);
    checkLocalStorage([MOCK_CARD_PRODUCT]);
  });

  it("should clear the recentlyViewed and update localStorage", () => {
    useRecentlyViewedStore.setState({
      byUser: { [MOCK_USER_ID]: [MOCK_CARD_PRODUCT, MOCK_CARD_PRODUCT_2] },
    });

    useRecentlyViewedStore.getState().clearRecentlyViewed(MOCK_USER_ID);

    const storeState = useRecentlyViewedStore.getState();

    expect(storeState.byUser[MOCK_USER_ID]).toEqual([]);
    checkLocalStorage([]);
  });

  it("recently-viewed: early return when user has no list", () => {
    const before = localStorage.getItem(STORAGE_KEY);
    useRecentlyViewedStore.setState({ byUser: {} });

    useRecentlyViewedStore.getState().clearRecentlyViewed(MOCK_USER_ID);

    expect(
      useRecentlyViewedStore.getState().byUser[MOCK_USER_ID]
    ).toBeUndefined();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  });

  it("should not add to recentlyViewed an existent product", () => {
    useRecentlyViewedStore.setState({
      byUser: { [MOCK_USER_ID]: [MOCK_CARD_PRODUCT] },
    });

    useRecentlyViewedStore
      .getState()
      .addToRecentlyViewed(MOCK_USER_ID, MOCK_CARD_PRODUCT);

    const storeState = useRecentlyViewedStore.getState();

    expect(storeState.byUser[MOCK_USER_ID]).toEqual([MOCK_CARD_PRODUCT]);
    checkLocalStorage([MOCK_CARD_PRODUCT]);
  });

  it("should add a product if it is not existent", () => {
    useRecentlyViewedStore.setState({
      byUser: { [MOCK_USER_ID]: [MOCK_CARD_PRODUCT] },
    });

    useRecentlyViewedStore
      .getState()
      .addToRecentlyViewed(MOCK_USER_ID, MOCK_CARD_PRODUCT_2);

    const storeState = useRecentlyViewedStore.getState();

    expect(storeState.byUser[MOCK_USER_ID]).toEqual([
      MOCK_CARD_PRODUCT_2,
      MOCK_CARD_PRODUCT,
    ]);
    checkLocalStorage([MOCK_CARD_PRODUCT_2, MOCK_CARD_PRODUCT]);
  });

  it("should eliminate last product of the list (first viewed) if adding a new product exceeded the limit of ten products", () => {
    const anotherMockProduct = { ...MOCK_CARD_PRODUCT, id: 10 };
    useRecentlyViewedStore.setState({
      byUser: { [MOCK_USER_ID]: MOCK_ARRAY_CARD_PRODUCT },
    });
    const oldestProduct = MOCK_ARRAY_CARD_PRODUCT[9];

    useRecentlyViewedStore
      .getState()
      .addToRecentlyViewed(MOCK_USER_ID, anotherMockProduct);

    const storeState = useRecentlyViewedStore.getState();

    expect(storeState.byUser[MOCK_USER_ID].length).toBe(10);
    expect(storeState.byUser[MOCK_USER_ID][0]).toEqual(anotherMockProduct);
    expect(storeState.byUser[MOCK_USER_ID]).not.toContain(oldestProduct);

    const expectedRecentlyViewed = [
      anotherMockProduct,
      ...MOCK_ARRAY_CARD_PRODUCT.slice(0, 9),
    ];
    checkLocalStorage(expectedRecentlyViewed);
  });

  it("should remove inactive products by id for the user", () => {
    const anotherMockProduct = { ...MOCK_CARD_PRODUCT, id: 10 };
    useRecentlyViewedStore.setState({
      byUser: {
        [MOCK_USER_ID]: [
          MOCK_CARD_PRODUCT,
          MOCK_CARD_PRODUCT_2,
          anotherMockProduct,
        ],
      },
    });

    useRecentlyViewedStore
      .getState()
      .removeInactiveProducts(MOCK_USER_ID, [
        MOCK_CARD_PRODUCT.id,
        anotherMockProduct.id,
      ]);

    const storeState = useRecentlyViewedStore.getState();
    expect(storeState.byUser[MOCK_USER_ID]).toEqual([MOCK_CARD_PRODUCT_2]);

    checkLocalStorage([MOCK_CARD_PRODUCT_2]);
  });

  it("removeInactiveProducts: early return when user has no list", () => {
    const before = localStorage.getItem(STORAGE_KEY);
    useRecentlyViewedStore.setState({ byUser: {} });

    useRecentlyViewedStore
      .getState()
      .removeInactiveProducts(MOCK_USER_ID, [MOCK_CARD_PRODUCT.id]);

    expect(
      useRecentlyViewedStore.getState().byUser[MOCK_USER_ID]
    ).toBeUndefined();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  });

  it("removeInactiveProducts: early return when ids=[] and user has a list", () => {
    useRecentlyViewedStore.setState({
      byUser: { [MOCK_USER_ID]: [MOCK_CARD_PRODUCT, MOCK_CARD_PRODUCT_2] },
    });

    useRecentlyViewedStore.getState().removeInactiveProducts(MOCK_USER_ID, []);

    expect(useRecentlyViewedStore.getState().byUser[MOCK_USER_ID]).toEqual([
      MOCK_CARD_PRODUCT,
      MOCK_CARD_PRODUCT_2,
    ]);
    checkLocalStorage([MOCK_CARD_PRODUCT, MOCK_CARD_PRODUCT_2]);
  });

  it("should not affect other users' lists", () => {
    useRecentlyViewedStore.setState({
      byUser: {
        [MOCK_USER_ID]: [MOCK_CARD_PRODUCT],
        [MOCK_USER_ID_2]: [MOCK_CARD_PRODUCT_2],
      },
    });

    const anotherMockProduct = { ...MOCK_CARD_PRODUCT, id: 10 };
    useRecentlyViewedStore
      .getState()
      .addToRecentlyViewed(MOCK_USER_ID, anotherMockProduct);

    const { byUser } = useRecentlyViewedStore.getState();

    expect(byUser[MOCK_USER_ID]).toEqual([
      anotherMockProduct,
      MOCK_CARD_PRODUCT,
    ]);

    expect(byUser[MOCK_USER_ID_2]).toEqual([MOCK_CARD_PRODUCT_2]);

    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) as string);
    expect(raw.state.byUser[MOCK_USER_ID_2]).toEqual([MOCK_CARD_PRODUCT_2]);

    checkLocalStorage([anotherMockProduct, MOCK_CARD_PRODUCT]);
    checkLocalStorageFor(MOCK_USER_ID_2, [MOCK_CARD_PRODUCT_2]);
  });
});
