import { Product } from "@/types/product";

export function normalizeProductCard(products: Product[]) {
  return products.map((product) => ({
    id: product.id,
    image:
      product.attributes.images.data?.[0]?.attributes.url ||
      "https://d2s30hray1l0uq.cloudfront.net/frontend/shoe-photography-featured-image-1024x512.jpg",
    name: product.attributes.name,
    price: product.attributes.price,
    gender: product.attributes.gender?.data?.attributes?.name ?? "No gender",
  }));
}
