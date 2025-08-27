import { MyProduct, Product } from "@/types/product";

/**
 * Normalizes an array of `Product` objects into a simpler format suitable for product card display.
 *
 * For each product:
 * - Picks the first image URL, or falls back to a default image if none are available.
 * - Extracts the product ID, name, price, and gender (or `"No gender"` if missing).
 *
 * @param {Product[]} products - An array of `Product` objects retrieved from the backend.
 * @returns {Array<{
 *   id: number;
 *   image: string;
 *   name: string;
 *   price: number;
 *   gender: string;
 *  sizes: number[]
 * }>} - A normalized array of objects ready for display in the product card UI.
 */

export function normalizeProductCard(products: Product[]) {
  return products.map((product) => ({
    id: product.id,
    image:
      product.attributes.images.data?.[0]?.attributes?.url ||
      "/assets/images/placeholders/400x400.svg",
    name: product.attributes.name,
    price: product.attributes.price,
    gender: product.attributes.gender?.data?.attributes?.name ?? "No gender",
    sizes: product.attributes.sizes.data.map((size) => size.attributes.value),
  }));
}

export function normalizeMyProductCard(products: MyProduct[]) {
  return products.map((product) => ({
    id: product.id,
    image:
      product.images?.[0]?.url || "/assets/images/placeholders/400x400.svg",
    name: product.name,
    price: product.price,
    gender: product.gender?.name ?? "No gender",
  }));
}

export function normalizeFullProduct(product: Product) {
  return {
    id: product.id,
    image:
      product.attributes.images.data?.[0]?.attributes?.url ||
      "/assets/images/placeholders/400x400.svg",
    name: product.attributes.name,
    price: product.attributes.price,
    gender: product.attributes.gender?.data?.attributes?.name ?? "No gender",
    brand: product.attributes.brand?.data?.attributes?.name ?? "No brand",
    color: product.attributes.color?.data?.attributes?.name ?? "No brand",
    category:
      product.attributes.categories?.data?.[0]?.attributes?.name ??
      "No category",
  };
}

export function normalizeProductToMyProduct(item: Product): MyProduct {
  const id = item.id;
  const attributes = item.attributes ?? item;

  const images =
    attributes.images?.data?.map((img) => {
      const image = img.attributes ?? {};
      const url = image.url;
      return { id: img.id, url };
    }) ?? [];

  const categories =
    attributes.categories?.data?.map((c) => ({
      id: c.id,
      name: c.attributes?.name ?? "",
    })) ?? [];

  const brand = attributes.brand?.data
    ? { id: attributes.brand.data.id }
    : { id: 0 };
  const color = attributes.color?.data
    ? { id: attributes.color.data.id }
    : { id: 0 };

  const gender = attributes.gender?.data
    ? {
        id: attributes.gender.data.id,
        name: attributes.gender.data.attributes?.name ?? "",
      }
    : { id: 0, name: "No gender" };

  const sizes =
    attributes.sizes?.data?.map((s) => ({
      id: s.id,
    })) ?? [];

  return {
    id,
    name: attributes.name ?? "",
    price: attributes.price,
    description: attributes.description ?? "",
    categories,
    gender,
    images,
    sizes,
    brand,
    color,
  };
}
