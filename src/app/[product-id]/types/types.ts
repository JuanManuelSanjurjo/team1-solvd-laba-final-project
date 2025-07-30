export interface ImageData {
  id: number;
  attributes: {
    url: string;
    name: string;
  };
}

export interface SizeData {
  id: number;
  attributes: {
    value: number;
  };
}

export interface ColorData {
  id: number;
  attributes: {
    name: string;
  };
}

export interface ProductAttributes {
  name: string;
  description: string;
  price: number;
  images?: {
    data: ImageData[];
  };
  color: {
    data: ColorData;
  };
  sizes: {
    data: SizeData[];
  };
}

export interface ProductApiResponse {
  id: number;
  attributes: ProductAttributes;
}

export interface NormalizedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  sizes: {
    id: number;
    value: number;
  }[];
  images?: {
    id: number;
    url: string;
    alt: string;
  }[];
  color: string;
}

export interface NormalizedImage {
  id: number;
  url: string;
  alt: string;
}

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
    name: product.attributes.name,
    description: product.attributes.description,
    price: product.attributes.price,
    images: product.attributes.images?.data?.map((img) => ({
      id: img.id,
      url: img.attributes.url,
      alt: img.attributes.name || `Product ${img.id} image`,
    })),
    sizes: product.attributes.sizes.data.map((size) => ({
      id: size.id,
      value: size.attributes.value,
    })),
    color: product.attributes.color.data.attributes.name,
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
