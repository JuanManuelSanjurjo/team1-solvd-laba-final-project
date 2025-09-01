import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MyProductsMainContent from "@/app/(side-bar)/my-products/components/MyProductsMainContent";

const pushMock = jest.fn();
let searchParamsMap: Record<string, string | null> = {
  page: "1",
  searchTerm: null,
};

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => ({
    get: (key: string) => searchParamsMap[key] ?? null,
    toString: () =>
      Object.entries(searchParamsMap)
        .filter(([, v]) => v != null)
        .map(([k, v]) => `${k}=${v}`)
        .join("&"),
  }),
}));

const mutateMock = jest.fn();
jest.mock("@/app/(side-bar)/my-products/hooks/useDeleteProduct", () => ({
  useDeleteProduct: () => ({ mutate: mutateMock }),
}));

let hookProducts: any[] = [];
let hookPagination: any = null;
let hookIsLoading = false;
let hookIsPending = false;

jest.mock(
  "@/app/(side-bar)/my-products/hooks/useQueryUserProductsPaged",
  () => ({
    __esModule: true,
    default: jest.fn(() => ({
      products: hookProducts,
      pagination: hookPagination,
      isPending: hookIsPending,
      isLoading: hookIsLoading,
    })),
  })
);

const deleteSearchTermMock = jest.fn();
const handleSearchInputChangeMock = jest.fn();
const handleSearchSubmitMock = jest.fn();
let searchInputMock = "";

jest.mock("@/app/(side-bar)/my-products/hooks/useSearchMyProducts", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    searchInput: searchInputMock,
    handleSearchInputChange: handleSearchInputChangeMock,
    handleSearchSubmit: handleSearchSubmitMock,
    deleteSearchTerm: deleteSearchTermMock,
  })),
}));

jest.mock("@/lib/normalizers/normalize-product-card", () => ({
  normalizeMyProductCard: (arr: any[]) =>
    arr.map((p) => ({ id: p.id, title: p.title })),
}));

jest.mock("@/components/skeletons/products/SkeletonCardContainer", () => ({
  __esModule: true,
  default: () => <div data-testid="skeleton" />,
}));

let lastHeaderIsEmpty: boolean | undefined;
jest.mock("@/app/(side-bar)/my-products/components/MyProductsHeader", () => ({
  __esModule: true,
  default: ({ isEmpty }: { isEmpty: boolean }) => {
    lastHeaderIsEmpty = isEmpty;
    return <div data-testid="myproducts-header">Header</div>;
  },
}));

jest.mock("@/components/ProductsEmptyState", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="empty-state">
      Empty
      <button data-testid="empty-cta" onClick={props.onClick}>
        {props.buttonText ?? "Add Product"}
      </button>
    </div>
  ),
}));

jest.mock("@/components/cards/CardContainer", () => ({
  __esModule: true,
  default: ({ children }: any) => (
    <div data-testid="card-container">{children}</div>
  ),
}));

jest.mock("@/components/cards/Card", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid={`card-${props.product.id}`}>
      <button onClick={props.onEdit} data-testid={`edit-${props.product.id}`}>
        edit
      </button>
      <button
        onClick={props.onDuplicate}
        data-testid={`dup-${props.product.id}`}
      >
        duplicate
      </button>
      <button onClick={props.onDelete} data-testid={`del-${props.product.id}`}>
        delete
      </button>
    </div>
  ),
}));

jest.mock("@/components/PaginationComponent", () => ({
  __esModule: true,
  default: ({ setPage }: any) => (
    <button data-testid="go-page-3" onClick={() => setPage(3)}>
      go page 3
    </button>
  ),
}));

jest.mock("@/components/SearchBar", () => ({
  __esModule: true,
  SearchBar: (props: any) => (
    <input data-testid="search-bar" value={props.value} readOnly />
  ),
}));

jest.mock(
  "@/app/(side-bar)/my-products/components/EditProductModalWrapper",
  () => ({
    __esModule: true,
    EditProductModalWrapper: ({ open, children }: any) =>
      open ? <div data-testid="modal">{children}</div> : null,
  })
);

jest.mock("@/app/(side-bar)/my-products/components/EditProductHeader", () => ({
  __esModule: true,
  EditProductHeader: ({ title }: any) => <h2>{title}</h2>,
}));

let formOnSuccessMock = jest.fn();
jest.mock("@/app/(side-bar)/my-products/components/EditProductForm", () => ({
  __esModule: true,
  EditProductForm: (props: any) => {
    formOnSuccessMock = props.onSuccess;
    return <form id="edit-product-form" data-testid="edit-form" />;
  },
}));

jest.mock("@/components/Button", () => ({
  __esModule: true,
  default: (props: any) => <button {...props} />,
}));

jest.mock("iconsax-react", () => ({
  Add: (props: any) => (
    <button data-testid="clear-search" onClick={props.onClick}>
      +
    </button>
  ),
}));

let useMediaQueryMock = jest.fn(() => true);
jest.mock("@mui/material", () => {
  const original = jest.requireActual("@mui/material");
  return {
    ...original,
    useMediaQuery: () => useMediaQueryMock(),
  };
});

function renderWithClient(ui: React.ReactElement) {
  const qc = new QueryClient();
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

const session = {
  user: { id: "u-1", jwt: "tok-1" },
  expires: "",
};

beforeEach(() => {
  jest.clearAllMocks();
  hookProducts = [];
  hookPagination = null;
  hookIsLoading = false;
  hookIsPending = false;
  searchParamsMap = { page: "1", searchTerm: null };
  lastHeaderIsEmpty = undefined;
  searchInputMock = "";
  useMediaQueryMock = jest.fn(() => true);
});

describe("MyProductsMainContent", () => {
  test("shows skeleton while loading", () => {
    hookIsLoading = true;
    renderWithClient(
      <MyProductsMainContent
        session={session as any}
        brandOptions={[]}
        colorOptions={[]}
        sizeOptions={[]}
        categoryOptions={[]}
      />
    );
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("card-container")).not.toBeInTheDocument();
    expect(screen.queryByTestId("empty-state")).not.toBeInTheDocument();
  });

  test("shows skeleton while pending", () => {
    hookIsPending = true;
    renderWithClient(
      <MyProductsMainContent
        session={session as any}
        brandOptions={[]}
        colorOptions={[]}
        sizeOptions={[]}
        categoryOptions={[]}
      />
    );
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("card-container")).not.toBeInTheDocument();
    expect(screen.queryByTestId("empty-state")).not.toBeInTheDocument();
  });

  test("shows empty state and header isEmpty=true when there are no products", () => {
    hookProducts = [];
    renderWithClient(
      <MyProductsMainContent
        session={session as any}
        brandOptions={[]}
        colorOptions={[]}
        sizeOptions={[]}
        categoryOptions={[]}
      />
    );
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(lastHeaderIsEmpty).toBe(true);
    expect(screen.queryByTestId("card-container")).not.toBeInTheDocument();
  });

  test("renders list, triggers delete with imageIds, and header isEmpty=false", () => {
    hookProducts = [
      {
        id: 10,
        title: "A",
        images: [{ id: 1 }, { id: 2 }],
      },
      {
        id: 20,
        title: "B",
        images: [{ id: 3 }],
      },
    ];
    renderWithClient(
      <MyProductsMainContent
        session={session as any}
        brandOptions={[]}
        colorOptions={[]}
        sizeOptions={[]}
        categoryOptions={[]}
      />
    );
    expect(screen.getByTestId("card-container")).toBeInTheDocument();
    expect(screen.getByTestId("card-10")).toBeInTheDocument();
    expect(screen.getByTestId("card-20")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("del-10"));
    expect(mutateMock).toHaveBeenCalledWith({
      productId: 10,
      imageIds: [1, 2],
    });
    expect(lastHeaderIsEmpty).toBe(false);
  });

  test("deletes product with empty imageIds when product has no images", () => {
    hookProducts = [{ id: 30, title: "NoImages" }];
    renderWithClient(
      <MyProductsMainContent
        session={session as any}
        brandOptions={[]}
        colorOptions={[]}
        sizeOptions={[]}
        categoryOptions={[]}
      />
    );
    fireEvent.click(screen.getByTestId("del-30"));
    expect(mutateMock).toHaveBeenCalledWith({
      productId: 30,
      imageIds: [],
    });
  });

  test("opens edit modal with title 'Edit Product' when clicking edit", async () => {
    hookProducts = [
      { id: 10, title: "A", images: [] },
      { id: 20, title: "B", images: [] },
    ];
    renderWithClient(
      <MyProductsMainContent
        session={session as any}
        brandOptions={[]}
        colorOptions={[]}
        sizeOptions={[]}
        categoryOptions={[]}
      />
    );
    fireEvent.click(screen.getByTestId("edit-10"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText("Edit Product")).toBeInTheDocument();

    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveAttribute("form", "edit-product-form");

    await act(async () => {
      formOnSuccessMock();
    });

    await waitFor(() => {
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  test("modal closes when onSuccess is called on the form", async () => {
    hookProducts = [{ id: 10, title: "A", images: [] }];
    renderWithClient(
      <MyProductsMainContent
        session={session as any}
        brandOptions={[]}
        colorOptions={[]}
        sizeOptions={[]}
        categoryOptions={[]}
      />
    );
    fireEvent.click(screen.getByTestId("edit-10"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();

    await act(async () => {
      formOnSuccessMock();
    });

    await waitFor(() => {
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  test('opens duplicate modal and shows title "Add Product"', () => {
    hookProducts = [
      { id: 10, title: "A", images: [] },
      { id: 20, title: "B", images: [] },
    ];
    renderWithClient(
      <MyProductsMainContent
        session={session as any}
        brandOptions={[]}
        colorOptions={[]}
        sizeOptions={[]}
        categoryOptions={[]}
      />
    );
    fireEvent.click(screen.getByTestId("dup-10"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText("Add Product")).toBeInTheDocument();
  });

  test("renders pagination and pushes new page on click", () => {
    hookProducts = [{ id: 10, title: "A", images: [] }];
    hookPagination = { page: 1, pageCount: 3, pageSize: 16, total: 17 };
    searchParamsMap = { page: "1", searchTerm: null };
    renderWithClient(
      <MyProductsMainContent
        session={session as any}
        brandOptions={[]}
        colorOptions={[]}
        sizeOptions={[]}
        categoryOptions={[]}
      />
    );
    fireEvent.click(screen.getByTestId("go-page-3"));
    expect(pushMock).toHaveBeenCalledWith(expect.stringMatching(/\bpage=3\b/));
  });

  test("pagination component is not rendered when there is no pagination data", () => {
    hookProducts = [{ id: 10, title: "A", images: [] }];
    hookPagination = null;
    renderWithClient(
      <MyProductsMainContent
        session={session as any}
        brandOptions={[]}
        colorOptions={[]}
        sizeOptions={[]}
        categoryOptions={[]}
      />
    );
    expect(screen.queryByTestId("go-page-3")).not.toBeInTheDocument();
  });

  test("shows searchTerm chip and clears it with the Add(+) icon", () => {
    hookProducts = [{ id: 10, title: "A", images: [] }];
    searchParamsMap = { page: "1", searchTerm: "nike air zoom very long term" };
    renderWithClient(
      <MyProductsMainContent
        session={session as any}
        brandOptions={[]}
        colorOptions={[]}
        sizeOptions={[]}
        categoryOptions={[]}
      />
    );
    expect(screen.getByText(/Search results for/i)).toBeInTheDocument();
    expect(
      screen.getByText("nike air zoom very long term")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("clear-search"));
    expect(deleteSearchTermMock).toHaveBeenCalled();
  });

  test("handles empty state button click correctly", () => {
    hookProducts = [];
    renderWithClient(
      <MyProductsMainContent
        session={session as any}
        brandOptions={[]}
        colorOptions={[]}
        sizeOptions={[]}
        categoryOptions={[]}
      />
    );
    const emptyCtaButton = screen.getByTestId("empty-cta");
    expect(emptyCtaButton).toBeInTheDocument();
    fireEvent.click(emptyCtaButton);
    expect(pushMock).toHaveBeenCalledWith("/my-products/add-product");
  });
});
