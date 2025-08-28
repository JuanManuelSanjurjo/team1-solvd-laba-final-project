import { useQuery } from "@tanstack/react-query";
import {
  MyProduct,
  PaginatedProducts,
  Product,
  ProductFilters,
} from "@/types/product";
import { fetchProducts } from "@/lib/actions/fetch-products";
import { normalizeProductToMyProduct } from "@/lib/normalizers/normalize-product-card";

interface UseQueryUserProductsPagedProps {
  userId?: number | string | null;
  token?: string | null;
  pageNumber: number;
  searchQuery?: string;
  pageSize: number;
}

/**
 * Fetches a paginated list of products belonging to a specific user.
 *
 * Uses React Query to fetch products with filtering, searching, and pagination support.
 * Normalizes the API product response into a `MyProduct` type for UI consumption.
 *
 * @param {Object} props Hook props
 * @param {number|string|null} [props.userId] ID of the user whose products are being fetched.
 * @param {string|null} [props.token] JWT token for authentication.
 * @param {number} props.pageNumber Current page number.
 * @param {number} props.pageSize Number of products per page.
 * @param {string} [props.searchQuery] Optional search term.
 *
 * @returns {Object} Hook state
 * - `data` {PaginatedProducts | undefined} Full API response with pagination metadata.
 * - `products` {MyProduct[]} Normalized product array.
 * - `pagination` {PaginatedProducts["meta"]["pagination"] | undefined} Pagination metadata.
 * - `isPending` {boolean} Whether query is currently fetching.
 * - `isLoading` {boolean} Whether query is initially loading.
 */

export default function useQueryUserProductsPaged({
  userId,
  token,
  pageNumber,
  pageSize,
  searchQuery,
}: UseQueryUserProductsPagedProps) {
  const numericUserId = userId ? Number(userId) : undefined;

  const query = useQuery<PaginatedProducts>({
    queryKey: [
      "user-products",
      userId,
      token,
      pageNumber,
      pageSize,
      searchQuery ?? "",
    ],
    queryFn: async () => {
      if (!numericUserId || !token) {
        return { products: [], meta: undefined };
      }

      const baseFilters = {
        user: {
          userId,
          token,
        },
      } as ProductFilters;

      const paginated = await fetchProducts(
        baseFilters,
        pageNumber,
        pageSize,
        searchQuery && searchQuery.trim() !== "" ? searchQuery.trim() : null,
        ["name", "color.name", "gender.name"],
        ["all"]
      );

      return paginated;
    },
    enabled: !!numericUserId && !!token,
  });

  const items = query.data?.data ?? [];

  const products: MyProduct[] = (items as Product[]).map((item: Product) =>
    normalizeProductToMyProduct(item)
  );

  return {
    data: query.data,
    products: products ?? [],
    pagination: query.data?.meta.pagination,
    isPending: query.isFetching,
    isLoading: query.isLoading,
  };
}
