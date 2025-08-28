export interface Product {
  id: number;
  attributes: {
    name: string;
    price: number;
    description: string;
    images: {
      data:
        | {
            id: number;
            attributes: {
              url: string;
            };
          }[]
        | null;
    };
    gender: {
      data: {
        id: number;
        attributes: {
          name: string;
        };
      };
    };
    brand: {
      data: {
        id: number;
        attributes: {
          name: string;
        };
      };
    };
    color: {
      data: {
        id: number;
        attributes: {
          name: string;
        };
      };
    };
    categories: {
      data:
        | {
            id: number;
            attributes: {
              name: string;
            };
          }[]
        | null;
    };
    sizes: {
      data:
        | {
            id: number;
            attributes: {
              value: number;
            };
          }[]
        | null;
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
  user?: {
    userId: string;
    token: string;
  };
};

export interface MyProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  categories: { id: number; name: string }[];
  gender: {
    id: number;
    name: string;
  };
  images: {
    id: number;
    url: string;
  }[];
  sizes: {
    id: number;
  }[];
  brand: {
    id: number;
  };
  color: {
    id: number;
  };
}
