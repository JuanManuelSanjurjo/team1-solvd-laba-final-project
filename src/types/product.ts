export interface Product {
  id: number;
  attributes: {
    name: string;
    price: number;
    images: {
      data:
        | {
            attributes: {
              url: string;
            };
          }[]
        | null;
    };
    gender: {
      data: {
        attributes: {
          name: string;
        };
      };
    };
  };
}
export type PaginatedProducts = {
  data: Product[];
  meta: {
    pagination: {
      page: number;
      pageCount: number;
      pageSize: number;
      total: number;
    };
  };
};
export type ProductFilters = {
  brands?: string[];
  sizes?: string[];
  genders?: string[];
  colors?: string[];
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
};
