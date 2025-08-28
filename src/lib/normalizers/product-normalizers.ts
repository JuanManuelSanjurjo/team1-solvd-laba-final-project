import {
  ProductApiResponse,
  NormalizedProduct,
  ImageData,
  NormalizedImage,
} from "@/types/product-types";

/**
 * Normalize the product data from the API response.
 * @param product - The product data from the API response.
 * @returns {NormalizedProduct} The normalized product data.
 */
export function normalizeProduct(
  product: ProductApiResponse,
): NormalizedProduct {
  return {
    id: product.id,
    name: product.attributes.name || "No name",
    description: product.attributes?.description || "No description",
    price: product.attributes?.price || 0,
    images: product.attributes.images?.data?.map((img) => ({
      id: img.id,
      url: img.attributes.url || "https://placehold.co/400",
      alt: img.attributes.name || `Product ${img.id} image`,
    })),
    sizes:
      product.attributes?.sizes?.data?.map((size) => ({
        id: size.id,
        value: size.attributes.value,
      })) || [],
    color: product.attributes.color?.data?.attributes?.name || "Not disclosed",
    gender: product.attributes.gender?.data?.attributes.name,
  };
}
/**
 * Normalize only the images data from the API response.
 * @param images - The images data from the API response.
 * @returns {NormalizedImage[]} The normalized images data.
 */
export function normalizeImages(images: ImageData[]): NormalizedImage[] {
  return images.map((img) => ({
    id: img.id,
    url: img.attributes.url,
    alt: img.attributes.name,
  }));
}
