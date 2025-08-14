/**
 * Tests for MyProductsMainContent
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mocks (must be before importing component internals if those modules are imported at top-level)
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

jest.mock("@/app/(side-bar)/my-products/components/MyProductsHeader", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="my-products-header">
      Header - isEmpty:{String(props.isEmpty)}
    </div>
  ),
}));

jest.mock("@/components/MyProductsEmptyState", () => ({
  __esModule: true,
  default: ({ title }: any) => <div data-testid="empty-state">{title}</div>,
}));

jest.mock("@/app/products/components/SkeletonCardContainer", () => ({
  __esModule: true,
  default: () => <div data-testid="skeletons">Skeletons</div>,
}));

jest.mock("@/lib/normalizers/normalizeProductCard", () => ({
  __esModule: true,
  normalizeMyProductCard: jest.fn(),
}));

jest.mock("@/components/cards/CardContainer", () => ({
  __esModule: true,
  default: ({ children }: any) => (
    <div data-testid="card-container">{children}</div>
  ),
}));

jest.mock("@/components/cards/Card", () => ({
  __esModule: true,
  // Card receives product, onEdit, onDelete -> simple mock rendering buttons to trigger callbacks
  default: ({ product, onEdit, onDelete }: any) => (
    <div data-testid={`card-${product.id}`}>
      <span>{product.title}</span>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  ),
}));

jest.mock("@/app/(side-bar)/my-products/components/EditProductForm", () => ({
  __esModule: true,
  // named export
  EditProductForm: () => <div data-testid="edit-product-form">EditForm</div>,
}));

jest.mock("@/app/(side-bar)/my-products/components/EditProductHeader", () => ({
  __esModule: true,
  EditProductHeader: ({ onClose }: any) => (
    <div data-testid="edit-product-header">
      EditHeader<button onClick={onClose}>X</button>
    </div>
  ),
}));

jest.mock("@/components/Button", () => ({
  __esModule: true,
  default: (props: any) => (
    <button {...props} data-testid="save-button">
      {props.children}
    </button>
  ),
}));

// Imports for typed mocks
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { normalizeMyProductCard } from "@/lib/normalizers/normalizeProductCard";
import MyProductsMainContent from "@/app/(side-bar)/my-products/components/MyProductsMainContent";

describe("MyProductsMainContent", () => {
  const mockedUseSession = useSession as jest.MockedFunction<any>;
  const mockedUseQuery = useQuery as jest.MockedFunction<any>;
  const mockedUseMutation = useMutation as jest.MockedFunction<any>;
  const mockedUseQueryClient = useQueryClient as jest.MockedFunction<any>;
  const mockedNormalize = normalizeMyProductCard as jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    // default session
    mockedUseSession.mockReturnValue({
      data: { user: { id: "1", jwt: "token" } },
    });
    // default query client
    mockedUseQueryClient.mockReturnValue({ invalidateQueries: jest.fn() });
  });

  it("shows skeleton while loading", () => {
    mockedUseQuery.mockReturnValue({ data: undefined, isLoading: true });
    const mutateMock = jest.fn();
    mockedUseMutation.mockReturnValue({ mutate: mutateMock });

    render(
      <MyProductsMainContent
        brandOptions={[]}
        colorOptions={[]}
        sizeOptions={[]}
      />
    );

    expect(screen.getByTestId("skeletons")).toBeInTheDocument();
    expect(screen.getByTestId("my-products-header")).toBeInTheDocument();
  });

  it("renders empty state when query returns empty array", () => {
    mockedUseQuery.mockReturnValue({ data: [], isLoading: false });
    mockedUseMutation.mockReturnValue({ mutate: jest.fn() });

    render(
      <MyProductsMainContent
        brandOptions={[]}
        colorOptions={[]}
        sizeOptions={[]}
      />
    );

    // The component passes title "You don't have any products yet" to MyProductsEmptyState
    expect(screen.getByTestId("empty-state")).toHaveTextContent(
      "You don't have any products yet"
    );
  });

  it("renders cards and opens edit modal when Edit clicked; delete calls mutate", async () => {
    // original products data (as returned by useQuery)
    const rawProducts = [{ id: 11, name: "Raw Product", somethingElse: "x" }];
    // normalized products used by Card
    const normalized = [{ id: 1, title: "Normalized Product" }];

    mockedUseQuery.mockReturnValue({ data: rawProducts, isLoading: false });
    mockedNormalize.mockReturnValue(normalized);

    const mutateMock = jest.fn();
    mockedUseMutation.mockReturnValue({ mutate: mutateMock });

    render(
      <MyProductsMainContent
        brandOptions={[]}
        colorOptions={[]}
        sizeOptions={[]}
      />
    );

    // Card container and the card should be present
    expect(await screen.findByTestId("card-container")).toBeInTheDocument();
    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    // Edit button exists inside card
    const editBtn = screen.getByText("Edit");
    const deleteBtn = screen.getByText("Delete");

    // Click edit -> should open modal (EditProductHeader and EditProductForm are rendered inside modal)
    await userEvent.click(editBtn);

    // After clicking Edit, because we mocked EditProductForm and Header, they should show
    expect(
      await screen.findByTestId("edit-product-header")
    ).toBeInTheDocument();
    expect(screen.getByTestId("edit-product-form")).toBeInTheDocument();

    // Click delete -> should call mutate with the normalized product id (1)
    await userEvent.click(deleteBtn);
    expect(mutateMock).toHaveBeenCalledWith(1);
  });
});
