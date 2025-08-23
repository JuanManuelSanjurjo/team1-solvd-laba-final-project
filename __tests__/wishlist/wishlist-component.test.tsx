import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Wishlist from "@/app/(side-bar)/(profile)/my-wishlist/components/Wishlist";
import { useWishlistStore } from "@/store/wishlist-store";
import { useRouter } from "next/navigation";
import {
  useClientHydrated,
  useCleanUpGhostProducts,
} from "@/app/(side-bar)/(profile)/hooks/useCleanupGhostProducts";
import cardProduct from "@/components/cards/actions/types";
import {
  MOCK_CARD_PRODUCT,
  MOCK_CARD_PRODUCT_2,
  MOCK_USER_ID,
} from "__tests__/mocks/shared/mock-product-card";

jest.mock("@/store/wishlist-store", () => ({ useWishlistStore: jest.fn() }));
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));

jest.mock("@/app/(side-bar)/(profile)/hooks/useCleanupGhostProducts", () => ({
  useClientHydrated: jest.fn(),
  useCleanUpGhostProducts: jest.fn(),
}));

jest.mock("@/components/cards/CardContainer", () => (props: any) => (
  <div data-testid="card-container" data-length={props.length}>
    {props.children}
  </div>
));
jest.mock("@/components/cards/Card", () => (props: any) => (
  <div
    data-testid="card"
    data-id={props.product?.id}
    data-topaction={props.topAction}
  />
));
jest.mock("@/components/skeletons/products/SkeletonCardContainer", () => () => (
  <div data-testid="skeleton" />
));
jest.mock(
  "@/app/(side-bar)/(profile)/components/ProfileHeaderTitle",
  () => (props: any) => <h1 data-testid="title">{props.children}</h1>
);
jest.mock("@/components/MyProductsEmptyState", () => (props: any) => (
  <button data-testid="empty-go-products" onClick={props.onClick}>
    {props.buttonText}
  </button>
));
jest.mock("@/components/LogoBlackSvg", () => ({
  __esModule: true,
  LogoBlackSvg: () => null,
}));

const sessionProp = { user: { id: MOCK_USER_ID } } as any;

function setupStoreMock(
  opts: {
    byUser?: Record<string, cardProduct[]>;
    removeInactiveProducts?: jest.Mock;
  } = {}
) {
  const removeInactiveProducts =
    opts.removeInactiveProducts ??
    jest.fn((userId: string, ids: number[]) => {});
  const state = {
    byUser: opts.byUser ?? {},
    removeInactiveProducts,
  };
  const asMock = (fn: unknown) => fn as jest.Mock;

  asMock(useWishlistStore).mockImplementation((selector?: (s: any) => any) =>
    typeof selector === "function" ? selector(state) : state
  );
  return { removeInactiveProducts };
}

function setupRouterMock() {
  const push = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ push });
  return { push };
}

describe("Wishlist", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows skeleton when not hydrated", () => {
    setupStoreMock({ byUser: { [MOCK_USER_ID]: [MOCK_CARD_PRODUCT] } });
    setupRouterMock();

    (useClientHydrated as jest.Mock).mockReturnValue(false);
    (useCleanUpGhostProducts as jest.Mock).mockReturnValue(false);

    render(<Wishlist session={sessionProp} />);

    expect(screen.getByTestId("title")).toHaveTextContent("My wishlist");
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();

    expect((useCleanUpGhostProducts as jest.Mock).mock.calls[0][0]).toEqual([]);
  });

  it("shows EmptyState and go to /products when hydrated and empty list", () => {
    setupStoreMock({ byUser: {} });
    const { push } = setupRouterMock();

    (useClientHydrated as jest.Mock).mockReturnValue(true);
    (useCleanUpGhostProducts as jest.Mock).mockReturnValue(false);

    render(<Wishlist session={sessionProp} />);

    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();

    const btn = screen.getByTestId("empty-go-products");
    fireEvent.click(btn);
    expect(push).toHaveBeenCalledWith("/products");
  });

  it("renders CardContainer and Cards when there is products", () => {
    setupStoreMock({
      byUser: { [MOCK_USER_ID]: [MOCK_CARD_PRODUCT, MOCK_CARD_PRODUCT_2] },
    });
    setupRouterMock();

    (useClientHydrated as jest.Mock).mockReturnValue(true);
    (useCleanUpGhostProducts as jest.Mock).mockReturnValue(false);

    render(<Wishlist session={sessionProp} />);

    const container = screen.getByTestId("card-container");
    expect(container).toHaveAttribute("data-length", "2");

    const cards = screen.getAllByTestId("card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveAttribute("data-id", "1");
    expect(cards[1]).toHaveAttribute("data-id", "2");
    expect(cards[0]).toHaveAttribute("data-topaction", "cardButtonWishList");
  });

  it("calls useCleanUpGhostProducts with corrects IDs and it callback calls removeInactiveProducts(userId, ids)", () => {
    const removeInactiveProducts = jest.fn();
    setupStoreMock({
      byUser: { [MOCK_USER_ID]: [MOCK_CARD_PRODUCT, MOCK_CARD_PRODUCT_2] },
      removeInactiveProducts,
    });
    setupRouterMock();

    (useClientHydrated as jest.Mock).mockReturnValue(true);

    (useCleanUpGhostProducts as jest.Mock).mockReturnValue(false);

    render(<Wishlist session={sessionProp} />);

    const calls = (useCleanUpGhostProducts as jest.Mock).mock.calls;
    expect(calls).toHaveLength(1);
    const [idsArg, callback] = calls[0];

    expect(idsArg).toEqual([MOCK_CARD_PRODUCT.id, MOCK_CARD_PRODUCT_2.id]);
    expect(typeof callback).toBe("function");

    const INACTIVE = [MOCK_CARD_PRODUCT_2.id];
    callback(INACTIVE);
    expect(removeInactiveProducts).toHaveBeenCalledWith(MOCK_USER_ID, INACTIVE);
  });

  it("if `loading` true, shows skeleton (even hydrated)", () => {
    setupStoreMock({ byUser: { [MOCK_USER_ID]: [MOCK_CARD_PRODUCT] } });
    setupRouterMock();

    (useClientHydrated as jest.Mock).mockReturnValue(true);
    (useCleanUpGhostProducts as jest.Mock).mockReturnValue(true);

    render(<Wishlist session={sessionProp} />);

    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("card")).not.toBeInTheDocument();
  });
});
