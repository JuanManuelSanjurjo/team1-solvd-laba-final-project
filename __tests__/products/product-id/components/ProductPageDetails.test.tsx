import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductPageDetails from "@/app/products/[product-id]/components/ProductPageDetails";

const addToRecentlyViewedMock = jest.fn();
jest.mock("@/store/recently-viewed-store", () => ({
  useRecentlyViewedStore: (selector: any) =>
    selector({ addToRecentlyViewed: addToRecentlyViewedMock }),
}));

const addItemMock = jest.fn();
jest.mock("@/store/cart-store", () => ({
  useCartStore: (selector: any) => selector({ addItem: addItemMock }),
}));

const showToastMock = jest.fn();
jest.mock("@/store/toastStore", () => ({
  useToastStore: () => ({ show: showToastMock }),
}));

jest.mock(
  "@/app/products/[product-id]/components/product-details/ProductMainData",
  () => ({
    __esModule: true,
    default: () => <div data-testid="ProductMainData" />,
  })
);

jest.mock("@/app/products/[product-id]/components/ProductSizes", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="ProductSizes">
      <button
        type="button"
        onClick={() => props.toggleSize(42)}
        aria-label="toggle-size-42"
      >
        toggle 42
      </button>
    </div>
  ),
}));

jest.mock(
  "@/app/products/[product-id]/components/product-details/ProductDescription",
  () => ({
    __esModule: true,
    default: () => <div data-testid="ProductDescription" />,
  })
);

jest.mock(
  "@/app/products/[product-id]/components/product-details/ProductPageButtons",
  () => ({
    __esModule: true,
    default: (props: any) => (
      <div
        data-testid="ProductPageButtons"
        data-cardimage={props.cardProductInfo?.image}
        data-cardid={props.cardProductInfo?.id}
      >
        <button type="button" onClick={props.onAddToCart}>
          Add to cart
        </button>
      </div>
    ),
  })
);

const baseProduct = {
  id: 10,
  name: "Air Zoom",
  price: 199,
  gender: "Men",
  images: [{ url: "https://img/1.jpg", alt: "pic" }],
} as any;

const loggedSession = {
  user: { id: "u-1", email: "u1@test.com" },
} as any;

const guestSession = null;

describe("ProductPageDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("adds to recently viewed on mount when logged in", () => {
    render(
      <ProductPageDetails product={baseProduct} session={loggedSession} />
    );

    expect(addToRecentlyViewedMock).toHaveBeenCalledTimes(1);
    expect(addToRecentlyViewedMock).toHaveBeenCalledWith(
      "u-1",
      expect.objectContaining({
        id: 10,
        name: "Air Zoom",
        price: 199,
        gender: "Men",
        image: "https://img/1.jpg",
      })
    );
  });

  it("does NOT add to recently viewed when logged out", () => {
    render(<ProductPageDetails product={baseProduct} session={guestSession} />);
    expect(addToRecentlyViewedMock).not.toHaveBeenCalled();
  });

  it("shows toast error if trying to add to cart with no selected sizes (logged in)", () => {
    render(
      <ProductPageDetails product={baseProduct} session={loggedSession} />
    );

    fireEvent.click(screen.getByText(/add to cart/i));

    expect(addItemMock).not.toHaveBeenCalled();
    expect(showToastMock).toHaveBeenCalledWith({
      severity: "error",
      message: "Please select a size before adding to cart",
    });
  });

  it("adds one cart item per selected size (logged in)", () => {
    render(
      <ProductPageDetails product={baseProduct} session={loggedSession} />
    );

    fireEvent.click(screen.getByLabelText("toggle-size-42"));
    fireEvent.click(screen.getByText(/add to cart/i));

    expect(showToastMock).not.toHaveBeenCalled();
    expect(addItemMock).toHaveBeenCalledTimes(1);
    expect(addItemMock).toHaveBeenCalledWith("u-1", {
      id: 10,
      name: "Air Zoom",
      price: 199,
      image: "https://img/1.jpg",
      gender: "Men",
      size: 42,
      quantity: 1,
    });
  });

  it("does nothing on Add to cart when user is not logged in", () => {
    render(<ProductPageDetails product={baseProduct} session={guestSession} />);

    fireEvent.click(screen.getByText(/add to cart/i));

    expect(addItemMock).not.toHaveBeenCalled();
    expect(showToastMock).not.toHaveBeenCalled();
  });

  it("passes placeholder image in cardProductInfo when product has no images", () => {
    const noImgProduct = { ...baseProduct, images: [] };
    render(
      <ProductPageDetails product={noImgProduct} session={loggedSession} />
    );

    const buttons = screen.getByTestId("ProductPageButtons");
    expect(buttons).toHaveAttribute(
      "data-cardimage",
      "https://placehold.co/400"
    );
    expect(buttons).toHaveAttribute("data-cardid", "10");
  });

  it("toggles selected size off (no sizes selected → shows toast on add)", () => {
    render(
      <ProductPageDetails product={baseProduct} session={loggedSession} />
    );

    const toggle = screen.getByLabelText("toggle-size-42");
    fireEvent.click(toggle);
    fireEvent.click(toggle);

    fireEvent.click(screen.getByText(/add to cart/i));

    expect(addItemMock).not.toHaveBeenCalled();
    expect(showToastMock).toHaveBeenCalledWith({
      severity: "error",
      message: "Please select a size before adding to cart",
    });
  });
});
