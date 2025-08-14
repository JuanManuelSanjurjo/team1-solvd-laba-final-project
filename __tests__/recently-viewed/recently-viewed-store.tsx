import { useRecentlyViewedStore } from "@/store/recentlyviewed";
import CardProduct from "@/components/cards/actions/types/cardProduct";
import {
  mockCardProduct,
  mockCardProduct2,
  arrayCardProduct,
} from "__tests__/mocks/shared/mock-product-card";

const checkLocalStorage = (expectedRecentlyViewed: CardProduct[]) => {
  const storedData = JSON.parse(
    localStorage.getItem("recently-viewed-products") as string
  );
  expect(storedData.state.recentlyViewed).toEqual(expectedRecentlyViewed);
};

beforeEach(() => {
  localStorage.clear();
  useRecentlyViewedStore.setState({ recentlyViewed: [] });
});

describe("RecentlyViewedStore", () => {
  it("should add a product to the recentlyViewed and save to localStorage", () => {
    useRecentlyViewedStore.getState().addToRecentlyViewed(mockCardProduct);

    const storeState = useRecentlyViewedStore.getState();

    expect(storeState.recentlyViewed).toEqual([mockCardProduct]);
    checkLocalStorage([mockCardProduct]);
  });

  it("should clear the recentlyViewed and update localStorage", () => {
    useRecentlyViewedStore.setState({
      recentlyViewed: [mockCardProduct, mockCardProduct2],
    });

    useRecentlyViewedStore.getState().clearRecentlyViewed();

    const storeState = useRecentlyViewedStore.getState();

    expect(storeState.recentlyViewed).toEqual([]);
    checkLocalStorage([]);
  });

  it("should not add to recentlyViewed an existent product", () => {
    useRecentlyViewedStore.setState({ recentlyViewed: [mockCardProduct] });

    useRecentlyViewedStore.getState().addToRecentlyViewed(mockCardProduct);

    const storeState = useRecentlyViewedStore.getState();

    expect(storeState.recentlyViewed).toEqual([mockCardProduct]);
    checkLocalStorage([mockCardProduct]);
  });

  it("should add a product if it is not existent", () => {
    const anotherMockProduct = { ...mockCardProduct, id: 456 };
    useRecentlyViewedStore.setState({ recentlyViewed: [mockCardProduct] });

    useRecentlyViewedStore.getState().addToRecentlyViewed(anotherMockProduct);

    const storeState = useRecentlyViewedStore.getState();

    expect(storeState.recentlyViewed).toEqual([
      anotherMockProduct,
      mockCardProduct,
    ]);
    checkLocalStorage([anotherMockProduct, mockCardProduct]);
  });

  it("should eliminate last product of the list (first viewed) if adding a new product exceeded the limit of ten products", () => {
    const anotherMockProduct = { ...mockCardProduct, id: 10 };
    useRecentlyViewedStore.setState({ recentlyViewed: arrayCardProduct });
    const oldestProduct = arrayCardProduct[9];

    useRecentlyViewedStore.getState().addToRecentlyViewed(anotherMockProduct);

    const storeState = useRecentlyViewedStore.getState();

    expect(storeState.recentlyViewed.length).toBe(10);
    expect(storeState.recentlyViewed[0]).toEqual(anotherMockProduct);
    expect(storeState.recentlyViewed).not.toContain(oldestProduct);

    const expectedRecentlyViewed = [
      anotherMockProduct,
      ...arrayCardProduct.slice(0, 9),
    ];
    checkLocalStorage(expectedRecentlyViewed);
  });
});
