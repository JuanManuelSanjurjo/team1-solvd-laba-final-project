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
