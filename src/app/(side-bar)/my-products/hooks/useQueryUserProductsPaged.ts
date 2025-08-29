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
 * useQueryUserProductsPaged
 *
 * This hook handles the query of user products paged.
 * It uses the react-query library to fetch the products from the server.
 *
 * @component
 *
 * @param {UseQueryUserProductsPagedProps} props - The hook props
 * @returns {Object} The query state and functions
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
