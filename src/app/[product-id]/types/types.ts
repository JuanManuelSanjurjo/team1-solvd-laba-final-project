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
  images: {
    data: ImageData[];
  };
  color: {
    data: ColorData;
  };
  sizes: {
    data: SizeData[];
  };
}

export interface ProductData {
  id: number;
  attributes: ProductAttributes;
}

export interface ProductApiResponse {
  data: ProductData;
  meta: unknown;
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

export function normalizeProduct(
  product: ProductApiResponse,
): NormalizedProduct {
  return {
    id: product.data.id,
    name: product.data.attributes.name,
    description: product.data.attributes.description,
    price: product.data.attributes.price,
    // images: product.data.attributes.images.data.map((img) => ({
    //   id: img.id,
    //   url: img.attributes.url,
    //   alt: img.attributes.name,
    // })),
    sizes: product.data.attributes.sizes.data.map((size) => ({
      id: size.id,
      value: size.attributes.value,
    })),
    color: product.data.attributes.color.data.attributes.name,
  };
}
