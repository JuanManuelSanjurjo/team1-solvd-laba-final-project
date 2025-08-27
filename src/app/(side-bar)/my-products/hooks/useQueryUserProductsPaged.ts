import { useQuery } from "@tanstack/react-query";
import { MyProduct, ProductFilters } from "@/types/product";
import { fetchProducts } from "@/lib/actions/fetch-products";

interface UseQueryUserProductsPagedProps {
  userId?: number | string | null;
  token?: string | null;
  pageNumber: number;
  pageSize: number;
}

export default function useQueryUserProductsPaged({
  userId,
  token,
  pageNumber,
  pageSize,
}: UseQueryUserProductsPagedProps) {
  const numericUserId = userId ? Number(userId) : undefined;

  const query = useQuery<{ products: MyProduct[]; meta: any }>({
    queryKey: ["user-products", userId, token, pageNumber, pageSize],
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
        null,
        ["name", "color.name", "gender.name"],
        ["color.name", "gender.name", "images.url"]
      );

      const items = paginated?.data ?? [];

      const products: MyProduct[] = (items as any[]).map((item: any) =>
        mapStrapiProductToMyProduct(item)
      );

      return { products, meta: paginated?.meta };
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

function mapStrapiProductToMyProduct(item: any): MyProduct {
  const id = item.id ?? item?.attributes?.id ?? 0;
  const attrs = item.attributes ?? item;

  const images =
    attrs.images?.data?.map((img: any) => {
      const ia = img.attributes ?? {};
      const url =
        ia.url ||
        ia.formats?.thumbnail?.url ||
        ia.formats?.small?.url ||
        ia.formats?.medium?.url ||
        "";
      return { id: img.id, url };
    }) ?? [];

  const categories =
    attrs.categories?.data?.map((c: any) => ({
      id: c.id,
      name: c.attributes?.name ?? "",
    })) ?? [];

  const brand = attrs.brand?.data ? { id: attrs.brand.data.id } : { id: 0 };
  const color = attrs.color?.data ? { id: attrs.color.data.id } : { id: 0 };

  const gender = attrs.gender?.data
    ? {
        id: attrs.gender.data.id,
        name: attrs.gender.data.attributes?.name ?? "",
      }
    : { id: 0, name: "No gender" };

  const sizes =
    attrs.sizes?.data?.map((s: any) => ({
      id: s.id,
    })) ?? [];

  return {
    id,
    name: attrs.name ?? "",
    price:
      typeof attrs.price === "number" ? attrs.price : Number(attrs.price ?? 0),
    description: attrs.description ?? "",
    categories,
    gender,
    images,
    sizes,
    brand,
    color,
  };
}
