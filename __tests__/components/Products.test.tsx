import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Products from "@/components/Products";

const pushMock = jest.fn();
const useRouterMock = () => ({
  push: pushMock,
  prefetch: jest.fn(),
  replace: jest.fn(),
});
let searchParamsInstance: URLSearchParams;

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => useRouterMock()),
  useSearchParams: jest.fn(() => searchParamsInstance),
}));

const mockUseMediaBreakpoints = jest.fn();
jest.mock("@/hooks/useMediaBreakpoints", () => ({
  __esModule: true,
  default: () => mockUseMediaBreakpoints(),
}));

const mockUseQueryPagedProducts = jest.fn();
jest.mock("@/app/products/hooks/useQueryPageProducts", () => ({
  __esModule: true,
  default: (args: any) => mockUseQueryPagedProducts(args),
}));

jest.mock("@/lib/normalizers/normalize-product-card", () => ({
  normalizeProductCard: (arr: any[]) => arr,
}));

const mockHasActiveFilters: jest.Mock<boolean, any[]> = jest.fn();

jest.mock("@/lib/filter-utils", () => ({
  hasActiveFilters: (...args: Parameters<typeof mockHasActiveFilters>) =>
    mockHasActiveFilters(...args),
}));

jest.mock("@/lib/get-filters-from-search-params", () => ({
  getFiltersFromSearchParams: () => ({}),
}));

jest.mock("@/components/cards/CardContainer", () => ({
  __esModule: true,
  default: ({
    children,
    length,
  }: {
    children: React.ReactNode;
    length?: number;
  }) => (
    <div data-testid="card-container" data-length={String(length ?? 0)}>
      {children}
    </div>
  ),
}));

jest.mock("@/app/products/components/FiltersSideBar", () => ({
  __esModule: true,
  FilterSideBar: (props: any) => (
    <div
      data-testid="filters-sidebar"
      data-total={String(props.paginationTotal ?? "")}
      onClick={props.hideDrawer}
    />
  ),
}));

jest.mock("@/components/cards/Card", () => ({
  __esModule: true,
  default: (props: any) => (
    <div
      data-testid="card"
      data-topaction={props.topAction ?? ""}
      data-overlayaction={props.overlayAction ?? ""}
    >
      {props?.product?.name ?? "card"}
    </div>
  ),
}));

jest.mock("@/components/PaginationComponent", () => ({
  __esModule: true,
  default: ({ setPage }: { setPage: (n: number) => void }) => (
    <button data-testid="pagination-go-3" onClick={() => setPage(3)}>
      go-3
    </button>
  ),
}));

jest.mock("@/components/skeletons/SkeletonPagination", () => ({
  __esModule: true,
  default: () => <div data-testid="skeleton-pagination" />,
}));

jest.mock("@/components/ProductsEmptyState", () => ({
  __esModule: true,
  default: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  ),
}));

jest.mock("@/components/skeletons/products/SkeletonCardContainer", () => ({
  __esModule: true,
  default: () => <div data-testid="skeleton-card-container" />,
}));

jest.mock("iconsax-react", () => ({
  Add: (props: any) => <button data-testid="icon-add" {...props} />,
  FilterRemove: (props: any) => (
    <span data-testid="icon-filter-remove" {...props} />
  ),
  FilterSearch: (props: any) => (
    <span data-testid="icon-filter-search" {...props} />
  ),
}));

const baseProps = {
  session: null as any,
  brandOptions: [],
  colorOptions: [],
  sizeOptions: [],
  categoryOptions: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseMediaBreakpoints.mockReturnValue({ isMobile: false, isDesktop: true });
  searchParamsInstance = new URLSearchParams("page=1");
  mockUseQueryPagedProducts.mockReturnValue({
    data: [],
    pagination: { total: 0, page: 1, pageSize: 20, pageCount: 0 },
    isPending: false,
  });
  mockHasActiveFilters.mockReturnValue(false);
});

describe("Products", () => {
  it("renders skeleton list while pending", () => {
    mockUseQueryPagedProducts.mockReturnValue({
      data: undefined,
      pagination: undefined,
      isPending: true,
    });

    render(<Products {...baseProps} />);

    expect(screen.getByTestId("skeleton-card-container")).toBeInTheDocument();
  });

  it("renders empty state when there are no products", () => {
    mockUseQueryPagedProducts.mockReturnValue({
      data: [],
      pagination: { total: 0, page: 1, pageSize: 20, pageCount: 0 },
      isPending: false,
    });

    render(<Products {...baseProps} />);
    expect(
      screen.getByText("No products match this search")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Try another search or remove some filters!")
    ).toBeInTheDocument();
  });

  it("renders products and pagination when data exists", () => {
    mockUseQueryPagedProducts.mockReturnValue({
      data: [
        { id: 1, name: "Alpha" },
        { id: 2, name: "Beta" },
      ],
      pagination: { total: 2, page: 1, pageSize: 20, pageCount: 1 },
      isPending: false,
    });

    render(<Products {...baseProps} />);

    const cards = screen.getAllByTestId("card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("Alpha");
    expect(cards[1]).toHaveTextContent("Beta");

    expect(screen.queryByTestId("skeleton-pagination")).not.toBeInTheDocument();
    expect(screen.getByTestId("pagination-go-3")).toBeInTheDocument();
  });

  it("calls router.push with updated page when PaginationComponent triggers setPage", () => {
    searchParamsInstance = new URLSearchParams("searchTerm=nike&foo=bar");
    mockUseQueryPagedProducts.mockReturnValue({
      data: [{ id: 1, name: "Alpha" }],
      pagination: { total: 1, page: 1, pageSize: 20, pageCount: 1 },
      isPending: false,
    });

    render(<Products {...baseProps} />);
    fireEvent.click(screen.getByTestId("pagination-go-3"));

    expect(pushMock).toHaveBeenCalledTimes(1);
    const arg = (pushMock.mock.calls[0]?.[0] as string) || "";
    expect(arg).toContain("searchTerm=nike");
    expect(arg).toContain("page=3");
  });

  it("removes searchTerm and page on mobile chip click (deleteSearchTerm)", () => {
    mockUseMediaBreakpoints.mockReturnValue({
      isMobile: true,
      isDesktop: false,
    });
    searchParamsInstance = new URLSearchParams(
      "page=2&searchTerm=nike&foo=bar"
    );
    mockUseQueryPagedProducts.mockReturnValue({
      data: [{ id: 1, name: "Alpha" }],
      pagination: { total: 2, page: 2, pageSize: 20, pageCount: 1 },
      isPending: false,
    });

    render(<Products {...baseProps} />);

    const chipText = screen.getByText(/nike \(2\)/i);
    fireEvent.click(chipText);

    expect(pushMock).toHaveBeenCalledTimes(1);
    const arg = (pushMock.mock.calls[0]?.[0] as string) || "";
    expect(arg).toContain("?");
    expect(arg).toContain("foo=bar");
    expect(arg).not.toContain("searchTerm=");
    expect(arg).not.toContain("page=");
  });

  it("shows 'Search results for' when searchTerm exists on desktop", () => {
    mockUseMediaBreakpoints.mockReturnValue({
      isMobile: false,
      isDesktop: true,
    });
    searchParamsInstance = new URLSearchParams("searchTerm=adidas");

    render(<Products {...baseProps} />);
    expect(
      screen.getByRole("heading", { name: /Search results for/i })
    ).toBeInTheDocument();
    expect(screen.getByText("adidas")).toBeInTheDocument();
  });

  it("shows 'Search results' when filters are active and no searchTerm", () => {
    searchParamsInstance = new URLSearchParams("");
    mockHasActiveFilters.mockReturnValue(true);
    render(<Products {...baseProps} />);
    expect(
      screen.getByRole("heading", { name: /Search results/i })
    ).toBeInTheDocument();
  });

  it("shows 'Products' as default heading when no searchTerm and no active filters", () => {
    searchParamsInstance = new URLSearchParams("");
    mockHasActiveFilters.mockReturnValue(false);
    mockUseQueryPagedProducts.mockReturnValue({
      data: [],
      pagination: { total: 0, page: 1, pageSize: 20, pageCount: 0 },
      isPending: false,
    });

    render(<Products {...baseProps} />);

    const h1 = screen.getByRole("heading", {
      level: 1,
      name: /^\s*Products\s*$/i,
    });
    expect(h1).toBeInTheDocument();
  });

  it("passes session-based actions to Card (topAction/overlayAction) when session is present", () => {
    mockUseQueryPagedProducts.mockReturnValue({
      data: [{ id: 10, name: "Gamma" }],
      pagination: { total: 1, page: 1, pageSize: 20, pageCount: 1 },
      isPending: false,
    });

    const session = { user: { name: "Juan" } } as any;
    render(<Products {...baseProps} session={session} />);

    const card = screen.getByTestId("card");
    expect(card.getAttribute("data-topaction")).toBe("cardButtonWishList");
    expect(card.getAttribute("data-overlayaction")).toBe(
      "cardOverlayAddToCart"
    );
  });

  it("renders SkeletonPagination when pagination is missing", () => {
    mockUseQueryPagedProducts.mockReturnValue({
      data: [{ id: 1, name: "OnlyOne" }],
      pagination: undefined,
      isPending: false,
    });

    render(<Products {...baseProps} />);
    expect(screen.getByTestId("skeleton-pagination")).toBeInTheDocument();
  });

  it("closes the Drawer via backdrop (triggers onClose) on mobile temporary variant", () => {
    mockUseMediaBreakpoints.mockReturnValue({
      isMobile: true,
      isDesktop: false,
    });
    searchParamsInstance = new URLSearchParams("");

    mockUseQueryPagedProducts.mockReturnValue({
      data: [{ id: 1, name: "Alpha" }],
      pagination: { total: 1, page: 1, pageSize: 20, pageCount: 1 },
      isPending: false,
    });

    render(<Products {...baseProps} />);

    fireEvent.click(screen.getByText(/Filters/i));
    expect(screen.getByText(/Hide Filters/i)).toBeInTheDocument();
    const backdrop = document.querySelector(".MuiBackdrop-root") as HTMLElement;
    expect(backdrop).toBeTruthy();
    fireEvent.click(backdrop);

    expect(screen.getByText(/Filters/i)).toBeInTheDocument();
  });

  it("toggles filters panel using the FilterSideBar hideDrawer callback", () => {
    mockUseMediaBreakpoints.mockReturnValue({
      isMobile: false,
      isDesktop: true,
    });

    mockUseQueryPagedProducts.mockReturnValue({
      data: [{ id: 1, name: "Alpha" }],
      pagination: { total: 1, page: 1, pageSize: 20, pageCount: 1 },
      isPending: false,
    });

    render(<Products {...baseProps} />);
    expect(screen.getByText(/Hide Filters/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("filters-sidebar"));
    expect(screen.getByText(/Filters/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("filters-sidebar"));
    expect(screen.getByText(/Hide Filters/i)).toBeInTheDocument();
  });

  it("deletes searchTerm via desktop 'Add' icon (rotated plus) next to the chip", () => {
    mockUseMediaBreakpoints.mockReturnValue({
      isMobile: false,
      isDesktop: true,
    });
    searchParamsInstance = new URLSearchParams(
      "page=4&searchTerm=adidas&foo=bar"
    );

    mockUseQueryPagedProducts.mockReturnValue({
      data: [{ id: 1, name: "Alpha" }],
      pagination: { total: 1, page: 4, pageSize: 20, pageCount: 1 },
      isPending: false,
    });

    render(<Products {...baseProps} />);

    fireEvent.click(screen.getByTestId("icon-add"));

    expect(pushMock).toHaveBeenCalledTimes(1);
    const arg = String(pushMock.mock.calls[0]?.[0] ?? "");
    expect(arg).toContain("?");
    expect(arg).toContain("foo=bar");
    expect(arg).not.toContain("searchTerm=");
    expect(arg).not.toContain("page=");
  });

  it("shows mobile chip with (0) when pagination is missing", () => {
    mockUseMediaBreakpoints.mockReturnValue({
      isMobile: true,
      isDesktop: false,
    });
    searchParamsInstance = new URLSearchParams("searchTerm=adidas");

    mockUseQueryPagedProducts.mockReturnValue({
      data: [{ id: 1, name: "Alpha" }],
      pagination: undefined,
      isPending: false,
    });

    render(<Products {...baseProps} />);
    expect(screen.getByText(/adidas \(0\)/i)).toBeInTheDocument();
  });

  it("uses a right-anchored temporary Drawer on mobile", () => {
    mockUseMediaBreakpoints.mockReturnValue({
      isMobile: true,
      isDesktop: false,
    });
    searchParamsInstance = new URLSearchParams("");

    mockUseQueryPagedProducts.mockReturnValue({
      data: [{ id: 123, name: "Any" }],
      pagination: { total: 1, page: 1, pageSize: 20, pageCount: 1 },
      isPending: false,
    });

    render(<Products {...baseProps} />);

    const drawer = document.querySelector(".MuiDrawer-root") as HTMLElement;
    expect(drawer).toBeTruthy();
    expect(drawer.className).toMatch(/MuiDrawer-anchorRight/);
  });

  it("renders no cards when products are undefined (non-pending) and shows SkeletonPagination", () => {
    mockUseMediaBreakpoints.mockReturnValue({
      isMobile: false,
      isDesktop: true,
    });
    searchParamsInstance = new URLSearchParams("");

    mockUseQueryPagedProducts.mockReturnValue({
      data: undefined,
      pagination: undefined,
      isPending: false,
    });

    render(<Products {...baseProps} />);

    expect(screen.queryAllByTestId("card")).toHaveLength(0);
    expect(screen.getByTestId("skeleton-pagination")).toBeInTheDocument();
  });
});
