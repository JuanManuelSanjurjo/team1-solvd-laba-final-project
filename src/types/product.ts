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
    brand: {
      data: {
        attributes: {
          name: string;
        };
      };
    };
    color: {
      data: {
        attributes: {
          name: string;
        };
      };
    };
    categories: {
      data:
        | {
            attributes: {
              name: string;
            };
          }[]
        | null;
    };
    sizes: {
      data: {
        id: number;
        attributes: {
          value: number;
        };
      }[];
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
