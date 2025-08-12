import { ProductFilters, PaginatedProducts } from "@/types/product";
import { fetchProducts } from "@/lib/strapi/fetchProducts";
import { useQuery } from "@tanstack/react-query";

type useQueryPagedProductsProps = {
  filters: ProductFilters;
  pageNumber: number;
  pageSize: number;
  searchParams: string;
  searchTerm: string | null;
};

/**
 * useQueryPagedProducts
 *
 * This hook is used to fetch data based on the  filters.
 * It returns the data from the search term query if the search term is not null,
 * otherwise it returns the data from the filter search query.
 *
 * @param {Object} props - The props for the hook.
 * @param {Object} props.filters - The filters for the query.
 * @param {number} props.pageNumber - The page number for the query.
 * @param {number} props.pageSize - The page size for the query.
 * @param {string} props.searchParams - The search parameters for the query.
 * @param {string | null} props.searchTerm - The search term for the query.
 *
 * @returns {Object} The data from the search term query or the filter search query.
 */
export default function useQueryPagedProducts({
  filters,
  pageNumber,
  pageSize,
  searchParams,
  searchTerm,
}: useQueryPagedProductsProps) {
  const { data, isPending } = useQuery<PaginatedProducts>({
    queryKey: ["products", searchParams, searchTerm, pageNumber, pageSize],
    queryFn: () => fetchProducts(filters, pageNumber, pageSize),
    enabled: !searchTerm,
  });

  return { data: data?.data, pagination: data?.meta?.pagination, isPending };
}
