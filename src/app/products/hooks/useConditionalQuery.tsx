import { PRODUCTS_PER_PAGE } from "@/lib/constants/globals";
import useQueryPagedProducts from "./useQueryPageProducts";
import useQueryHeaderSearch from "./useQueryHeaderSearch";
import { ProductFilters } from "@/types/product";

type useConditionalQueryProps = {
  filters: ProductFilters;
  page: number;
  searchParams: string;
  searchTerm: string | null;
};

/**
 * useConditionalQuery
 *
 * This hook is used to fetch data based on the search term and filters.
 * It returns the data from the search term query if the search term is not null,
 * otherwise it returns the data from the filter search query.
 *
 * @param {Object} props - The props for the hook.
 * @param {Object} props.filters - The filters for the query.
 * @param {number} props.page - The page number for the query.
 * @param {string} props.searchParams - The search parameters for the query.
 * @param {string | null} props.searchTerm - The search term for the query.
 *
 * @returns {Object} The data from the search term query or the filter search query.
 */

export default function useConditionalQuery({
  filters,
  page,
  searchParams,
  searchTerm,
}: useConditionalQueryProps) {
  const filterSearchQuery = useQueryPagedProducts({
    filters,
    pageNumber: page,
    pageSize: PRODUCTS_PER_PAGE,
    searchParams: searchParams,
    searchTerm,
  });
  const searchTermQuery = useQueryHeaderSearch({
    searchTerm,
    pageNumber: page,
    pageSize: PRODUCTS_PER_PAGE,
  });

  return searchTerm ? searchTermQuery : filterSearchQuery;
}
