import { render, screen, fireEvent } from "@testing-library/react";
import CardButtonWishList from "@/components/cards/actions/CardButtonWishList";
import "@testing-library/jest-dom";
import { setupMockWishlistStore } from "__tests__/mocks/wishlist/mock-wishlist-data";

import {
  MOCK_CARD_PRODUCT,
  MOCK_USER_ID,
} from "__tests__/mocks/shared/mock-product-card";

jest.mock("@/store/wishlist-store", () => ({
  useWishlistStore: jest.fn(),
}));

const sessionProp = { user: { id: MOCK_USER_ID } } as any;

describe("CardButtonWishList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show 'Outline' icon and call 'addToWishList' when the product is not in the list", () => {
    const { mockAddToWishList } = setupMockWishlistStore({
      [MOCK_USER_ID]: [],
    });

    render(
      <CardButtonWishList product={MOCK_CARD_PRODUCT} session={sessionProp} />
    );

    const icon = screen.getByTestId("heart-icon");
    expect(icon).toHaveAttribute("data-variant", "Outline");

    fireEvent.click(icon);
    expect(mockAddToWishList).toHaveBeenCalledTimes(1);
    expect(mockAddToWishList).toHaveBeenCalledWith(
      MOCK_USER_ID,
      MOCK_CARD_PRODUCT
    );
  });

  it("should show 'Bold' icon and call 'removeFromWishList' when the product is already in the list", () => {
    const { mockRemoveFromWishList } = setupMockWishlistStore({
      [MOCK_USER_ID]: [MOCK_CARD_PRODUCT],
    });

    render(
      <CardButtonWishList product={MOCK_CARD_PRODUCT} session={sessionProp} />
    );

    const icon = screen.getByTestId("heart-icon");
    expect(icon).toHaveAttribute("data-variant", "Bold");

    fireEvent.click(icon);

    expect(mockRemoveFromWishList).toHaveBeenCalledTimes(1);
    expect(mockRemoveFromWishList).toHaveBeenCalledWith(
      MOCK_USER_ID,
      MOCK_CARD_PRODUCT.id
    );
  });

  it("should fall back to empty list when byUser[userId] is undefined (?? [])", () => {
    const { mockAddToWishList } = setupMockWishlistStore({});

    render(
      <CardButtonWishList product={MOCK_CARD_PRODUCT} session={sessionProp} />
    );

    const icon = screen.getByTestId("heart-icon");

    expect(icon).toHaveAttribute("data-variant", "Outline");

    fireEvent.click(icon);

    expect(mockAddToWishList).toHaveBeenCalledTimes(1);
    expect(mockAddToWishList).toHaveBeenCalledWith(
      MOCK_USER_ID,
      MOCK_CARD_PRODUCT
    );
  });
});
