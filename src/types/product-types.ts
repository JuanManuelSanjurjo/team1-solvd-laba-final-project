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
