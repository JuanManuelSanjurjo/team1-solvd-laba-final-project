import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useQueryPagedProducts from "@/app/products/hooks/useQueryPageProducts";
import { fetchProducts } from "@/lib/actions/fetch-products";

jest.mock("@/lib/actions/fetch-products");

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useQueryPagedProducts", () => {
  const mockProducts = {
    data: [{ id: 1, attributes: { name: "Test Product" } }],
    meta: { pagination: { page: 1, pageCount: 2, total: 1 } },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls fetchProducts with correct arguments when searchTerm is provided", async () => {
    (fetchProducts as jest.Mock).mockResolvedValueOnce(mockProducts);

    const { result } = renderHook(
      () =>
        useQueryPagedProducts({
          filters: { colors: ["red"] },
          pageNumber: 1,
          pageSize: 10,
          searchParams: "param=1",
          searchTerm: "shoes",
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(fetchProducts).toHaveBeenCalledWith(
      { colors: ["red"] },
      1,
      10,
      "shoes",
      ["name", "color.name", "gender.name"],
      ["color.name", "gender.name", "images.url"],
    );
    expect(result.current.data).toEqual(mockProducts.data);
    expect(result.current.pagination).toEqual(mockProducts.meta.pagination);
  });

  it("calls fetchProducts with null searchTerm", async () => {
    (fetchProducts as jest.Mock).mockResolvedValueOnce(mockProducts);

    const { result } = renderHook(
      () =>
        useQueryPagedProducts({
          filters: { genders: ["male"] },
          pageNumber: 2,
          pageSize: 5,
          searchParams: "param=2",
          searchTerm: null,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(fetchProducts).toHaveBeenCalledWith(
      { genders: ["male"] },
      2,
      5,
      null,
      ["name", "color.name", "gender.name"],
      ["color.name", "gender.name", "images.url"],
    );
  });

  it("returns loading state while pending", async () => {
    (fetchProducts as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );

    const { result } = renderHook(
      () =>
        useQueryPagedProducts({
          filters: {},
          pageNumber: 1,
          pageSize: 10,
          searchParams: "",
          searchTerm: null,
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isPending).toBe(true);
  });
});
