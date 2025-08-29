import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchResultsPreview from "@/components/header/SearchResultsPreview";
import { normalizeProductCard } from "@/lib/normalizers/normalize-product-card";
import { Product } from "@/types/product";
import { completeProductResponse } from "@/mocks/product";

jest.mock("@/components/header/SearchResultItem", () => ({
  __esModule: true,
  default: ({
    product,
    setIsSearching,
  }: {
    product: Product;
    setIsSearching: (value: boolean) => void;
  }) => (
    <div data-testid={product.id} onClick={() => setIsSearching(true)}>
      {product.id}
    </div>
  ),
}));

jest.mock("@/components/AiButton", () => ({
  __esModule: true,
  default: ({
    onGenerate,
    isLoading,
    label,
  }: {
    onGenerate: () => void;
    isLoading: boolean;
    label: string;
  }) => (
    <button data-testid="ai-button" onClick={onGenerate}>
      {label} - {isLoading ? "loading" : "idle"}
    </button>
  ),
}));

jest.mock("@/lib/normalizers/normalize-product-card", () => ({
  __esModule: true,
  normalizeProductCard: jest.fn((products: unknown[]) => products),
}));

describe("SearchResultsPreview", () => {
  const mockSetIsSearching = jest.fn();
  const mockGenerateFiltersWithAi = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders SearchResultItem for each product returned by normalizeProductCard", () => {
    const products: Product[] = [
      { ...completeProductResponse, id: 2499 },
      { ...completeProductResponse, id: 2500 },
    ];

    (normalizeProductCard as jest.Mock).mockReturnValue(products);

    render(
      <SearchResultsPreview
        products={products}
        setIsSearching={mockSetIsSearching}
        aiLoading={false}
        generateFiltersWithAi={mockGenerateFiltersWithAi}
      />,
    );

    expect(screen.getByTestId(2499)).toBeInTheDocument();
    expect(screen.getByTestId(2500)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(2499));
    expect(mockSetIsSearching).toHaveBeenCalledWith(true);

    expect(normalizeProductCard).toHaveBeenCalledWith(products);
  });

  it("shows empty state with 'No results found' and AiButton when there are no products", () => {
    const products: Product[] = [];

    (normalizeProductCard as jest.Mock).mockReturnValue(products);

    render(
      <SearchResultsPreview
        products={products}
        setIsSearching={mockSetIsSearching}
        aiLoading={false}
        generateFiltersWithAi={mockGenerateFiltersWithAi}
      />,
    );

    expect(screen.getByText("No results found")).toBeInTheDocument();

    const aiButton = screen.getByTestId("ai-button");
    expect(aiButton).toBeInTheDocument();
    expect(aiButton).toHaveTextContent("Use smart search - idle");

    fireEvent.click(aiButton);
    expect(mockGenerateFiltersWithAi).toHaveBeenCalled();
  });

  it("passes isLoading to AiButton and renders loading state", () => {
    const products: Product[] = [];
    (normalizeProductCard as jest.Mock).mockReturnValue(products);

    render(
      <SearchResultsPreview
        products={products}
        setIsSearching={mockSetIsSearching}
        aiLoading={true}
        generateFiltersWithAi={mockGenerateFiltersWithAi}
      />,
    );

    const aiButton = screen.getByTestId("ai-button");
    expect(aiButton).toHaveTextContent("Use smart search - loading");
  });

  it("clicking the overlay calls setIsSearching(false)", () => {
    const products: Product[] = [];
    (normalizeProductCard as jest.Mock).mockReturnValue(products);

    const { container } = render(
      <SearchResultsPreview
        products={products}
        setIsSearching={mockSetIsSearching}
        aiLoading={false}
        generateFiltersWithAi={mockGenerateFiltersWithAi}
      />,
    );

    const divs = container.querySelectorAll("div");
    const overlay = divs[divs.length - 1];
    expect(overlay).toBeDefined();

    fireEvent.click(overlay!);
    expect(mockSetIsSearching).toHaveBeenCalledWith(false);
  });
});
