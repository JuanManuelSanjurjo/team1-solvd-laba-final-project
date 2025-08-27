import { useQuery } from "@tanstack/react-query";
import { MyProduct } from "@/types/product";
import { fetchUserProductsPaginated } from "@/lib/actions/fetch-user-products";

type Props = {
  userId?: number | string | null;
  token?: string | null;
  pageNumber: number;
  pageSize: number;
};

export default function useQueryUserProductsPaged({
  userId,
  token,
  pageNumber,
  pageSize,
}: Props) {
  const numericUserId = userId ? Number(userId) : undefined;

  const query = useQuery<{ products: MyProduct[]; meta: any }>({
    queryKey: ["user-products", userId, pageNumber, pageSize],
    queryFn: async () => {
      if (!numericUserId || !token) {
        return { products: [], meta: undefined };
      }
      return fetchUserProductsPaginated(
        numericUserId,
        token,
        pageNumber,
        pageSize
      );
    },
    enabled: !!numericUserId && !!token,
  });

  return {
    data: query.data,
    products: query.data?.products ?? [],
    pagination: query.data?.meta?.pagination,
    isPending: query.isFetching,
    isLoading: query.isLoading,
  };
}
