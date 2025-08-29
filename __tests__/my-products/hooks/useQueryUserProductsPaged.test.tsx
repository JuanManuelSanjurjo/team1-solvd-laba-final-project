/**
 * __tests__/my-products/hooks/useQueryUserProductsPaged.test.tsx
 *
 * Integration-style tests for useQueryUserProductsPaged.
 * We mock fetchProducts to return a paginated response and assert the hook maps items to MyProduct.
 */

import { waitFor } from "@testing-library/react";
import { renderHook, AllTheProviders } from "__tests__/utils/test-utils";

jest.mock("@/lib/actions/fetch-products", () => ({
  fetchProducts: jest.fn(),
}));
const { fetchProducts } = require("@/lib/actions/fetch-products");

import useQueryUserProductsPaged from "@/app/(side-bar)/my-products/hooks/useQueryUserProductsPaged";

describe("useQueryUserProductsPaged", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns empty results when userId or token is missing (disabled)", async () => {
    const { result } = renderHook(
      () =>
        useQueryUserProductsPaged({
          userId: undefined,
          token: undefined,
          pageNumber: 1,
          pageSize: 16,
          searchQuery: "",
        }),
      { wrapper: AllTheProviders }
    );

    // Because no user/token, query is disabled and returns empty arrays
    expect(result.current.products).toEqual([]);
    expect(result.current.pagination).toBeUndefined();
  });

  test("maps fetchProducts response into MyProduct[]", async () => {
    // Build a fake Product item consistent with types in your code
    const fakeProduct = {
      id: 5,
      attributes: {
        name: "Shoe A",
        price: 123,
        description: "desc",
        images: {
          data: [
            { id: 11, attributes: { url: "u1" } },
            { id: 12, attributes: { url: "u2" } },
          ],
        },
        gender: { data: { id: 2, attributes: { name: "Men" } } },
        brand: { data: { id: 3, attributes: { name: "Brand" } } },
        color: { data: { id: 4, attributes: { name: "Red" } } },
        categories: { data: [{ id: 7, attributes: { name: "Shoes" } }] },
        sizes: { data: [{ id: 9, attributes: { value: 8 } }] },
      },
    };

    const paginated = {
      data: [fakeProduct],
      meta: {
        pagination: { page: 1, pageCount: 1, pageSize: 16, total: 1 },
      },
    };

    fetchProducts.mockResolvedValueOnce(paginated);

    const { result } = renderHook(
      () =>
        useQueryUserProductsPaged({
          userId: 1,
          token: "tok",
          pageNumber: 1,
          pageSize: 16,
          searchQuery: "",
        }),
      { wrapper: AllTheProviders }
    );

    // wait for the query to settle
    await waitFor(() => {
      expect(fetchProducts).toHaveBeenCalled();
      expect(result.current.products.length).toBe(1);
      const product = result.current.products[0];
      expect(product.id).toBe(5);
      expect(product.images[0].url).toBe("u1");
      expect(product.categories[0].name).toBe("Shoes");
      expect(result.current.pagination).toBeDefined();
    });
  });
});
