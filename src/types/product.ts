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
