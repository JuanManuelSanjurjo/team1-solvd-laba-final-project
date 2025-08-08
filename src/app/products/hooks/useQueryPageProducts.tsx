import { ProductFilters, PaginatedProducts } from "@/types/product";
import { fetchProducts } from "@/lib/strapi/fetchProducts";
import { useQuery } from "@tanstack/react-query";

export default function useQueryPagedProducts(
  filters: ProductFilters,
  pageNumber: number,
  pageSize: number,
  searchParams: string,
) {
  const { data, isPending } = useQuery<PaginatedProducts>({
    queryKey: ["products", searchParams.toString(), pageNumber],
    queryFn: () => fetchProducts(filters, pageNumber, pageSize),
  });

  return { data: data?.data, pagination: data?.meta?.pagination, isPending };
}
