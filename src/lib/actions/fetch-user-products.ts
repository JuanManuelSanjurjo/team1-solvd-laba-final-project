// lib/actions/fetch-user-products-paginated.ts
import { MyProduct } from "@/types/product";

/**
 * Fetch products that belong to a given user (paginated).
 * Returns { products, meta } where products are mapped to MyProduct.
 */
export async function fetchUserProductsPaginated(
  userId: number,
  token: string,
  pageNumber = 1,
  pageSize = 16
): Promise<{ products: MyProduct[]; meta: any }> {
  const baseUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  baseUrl.searchParams.set("populate", "*");
  baseUrl.searchParams.set("pagination[page]", String(pageNumber));
  baseUrl.searchParams.set("pagination[pageSize]", String(pageSize));
  // filter by user id
  baseUrl.searchParams.set("filters[userID][id][$eq]", String(userId));

  const res = await fetch(baseUrl.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch user products: ${res.status} ${text}`);
  }

  const json = await res.json();

  const products: MyProduct[] = (json.data || []).map((item: any) =>
    mapStrapiProductToMyProduct(item)
  );

  return { products, meta: json.meta };
}

/** Helper: convert a Strapi product item (data entry) to your MyProduct shape */
function mapStrapiProductToMyProduct(item: any): MyProduct {
  const id = item.id ?? item?.attributes?.id ?? 0;
  const attrs = item.attributes ?? item;

  const images =
    attrs.images?.data?.map((img: any) => {
      const ia = img.attributes ?? {};
      // prefer full url, fallback to thumbnail url
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
      // original MyProduct sizes only require id; add value if needed later
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
