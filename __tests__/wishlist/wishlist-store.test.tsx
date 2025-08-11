import { useWishlistStore } from "@/store/wishlist";
import {
  mockCardProduct,
  mockCardProduct2,
} from "__tests__/mocks/shared/mock-product-card";
import CardProduct from "@/components/cards/actions/types/cardProduct";

const checkLocalStorage = (expectedWishlist: CardProduct[]) => {
  const storedData = JSON.parse(
    localStorage.getItem("wishlist-storage") as string
  );
  expect(storedData.state.wishList).toEqual(expectedWishlist);
};

beforeEach(() => {
  localStorage.clear();
  useWishlistStore.setState({ wishList: [] });
});

describe("WishlistStore", () => {
  it("should add a product to the wishlist and save to localStorage", () => {
    useWishlistStore.getState().addToWishList(mockCardProduct);

    const storeState = useWishlistStore.getState();

    expect(storeState.wishList).toEqual([mockCardProduct]);
    checkLocalStorage([mockCardProduct]);
  });

  it("should remove a product from the wishlist and update localStorage", () => {
    useWishlistStore.setState({ wishList: [mockCardProduct] });

    useWishlistStore.getState().removeFromWishList(1);

    const storeState = useWishlistStore.getState();

    expect(storeState.wishList).toEqual([]);
    checkLocalStorage([]);
  });

  it("should clear the wishlist and update localStorage", () => {
    useWishlistStore.setState({
      wishList: [mockCardProduct, mockCardProduct2],
    });

    useWishlistStore.getState().clearWishList();

    const storeState = useWishlistStore.getState();

    expect(storeState.wishList).toEqual([]);
    checkLocalStorage([]);
  });

  it("should not add to wishlist an existent product", () => {
    useWishlistStore.setState({ wishList: [mockCardProduct] });

    useWishlistStore.getState().addToWishList(mockCardProduct);

    const storeState = useWishlistStore.getState();

    expect(storeState.wishList).toEqual([mockCardProduct]);
    checkLocalStorage([mockCardProduct]);
  });

  it("should add a product if it is not existent", () => {
    const anotherMockProduct = { ...mockCardProduct, id: 456 };
    useWishlistStore.setState({ wishList: [mockCardProduct] });

    useWishlistStore.getState().addToWishList(anotherMockProduct);

    const storeState = useWishlistStore.getState();

    expect(storeState.wishList).toEqual([mockCardProduct, anotherMockProduct]);
    checkLocalStorage([mockCardProduct, anotherMockProduct]);
  });
});
