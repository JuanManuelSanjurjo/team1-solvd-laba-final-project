import { useQuery } from "@tanstack/react-query";
import { fetchAllProductsBySearch } from "@/lib/strapi/fetchProductsBySearch";
import { PaginatedProducts } from "@/types/product";

type useQueryHeaderSearchProps = {
  searchTerm: string | null;
  pageNumber?: number;
  pageSize?: number;
};

/**
 * useQueryHeaderSearch
 *
 * This hook is used to fetch data based on the search term.
 * It returns the data from the search term query if the search term is not null,
 * otherwise it returns the data from the filter search query.
 *
 * @param {Object} props - The props for the hook.
 * @param {string | null} props.searchTerm - The search term for the query.
 * @param {number} props.pageNumber - The page number for the query.
 * @param {number} props.pageSize - The page size for the query.
 *
 * @returns {Object} The data from the search term query or the filter search query.
 */

export default function useQueryHeaderSearch({
  searchTerm,
  pageNumber,
  pageSize,
}: useQueryHeaderSearchProps) {
  const { data, isPending } = useQuery<PaginatedProducts>({
    queryKey: ["search-bar-products", searchTerm, pageNumber, pageSize],
    queryFn: () =>
      fetchAllProductsBySearch(
        searchTerm || "",
        ["name", "color.name", "gender.name"],
        ["color.name", "gender.name", "images.url"],
        pageNumber,
        pageSize,
      ),
    enabled: !!searchTerm,
  });
  return { data: data?.data, pagination: data?.meta?.pagination, isPending };
}
