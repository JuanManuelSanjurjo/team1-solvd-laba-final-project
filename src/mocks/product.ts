import { NormalizedProduct } from "@/types/product-types";
import { Product, MyProduct } from "@/types/product";

export const product: NormalizedProduct = {
  id: 1,
  name: "Nike Air Max 97",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  price: 100,
  sizes: [
    { id: 1, value: 45 },
    { id: 2, value: 34 },
    { id: 3, value: 23 },
  ],
  images: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Sneakers",
    },
  ],
  color: "Black",
  gender: "Men's shoes",
};

export const myProductMock: MyProduct = {
  id: 1,
  name: "Sneaker Air Max",
  price: 120,
  description: "Comfortable running sneakers with breathable mesh.",
  categories: [
    { id: 10, name: "Shoes" },
    { id: 11, name: "Running" },
  ],
  gender: {
    id: 2,
    name: "Men",
  },
  images: [
    { id: 101, url: "/images/products/airmax1.png" },
    { id: 102, url: "/images/products/airmax2.png" },
  ],
  sizes: [{ id: 42 }, { id: 43 }, { id: 44 }],
  brand: {
    id: 5,
  },
  color: {
    id: 7,
  },
};

export const completeProductResponse: Product = {
  id: 123,
  attributes: {
    name: "Classic Sneaker",
    price: 7999,
    description: "A comfortable, everyday sneaker with a timeless design.",
    images: {
      data: [
        {
          id: 11,
          attributes: {
            url: "https://example.com/images/product-123-1.jpg",
          },
        },
        {
          id: 12,
          attributes: {
            url: "https://example.com/images/product-123-2.jpg",
          },
        },
      ],
    },
    gender: {
      data: {
        id: 1,
        attributes: {
          name: "Unisex",
        },
      },
    },
    brand: {
      data: {
        id: 2,
        attributes: {
          name: "Acme Shoes",
        },
      },
    },
    color: {
      data: {
        id: 3,
        attributes: {
          name: "Black",
        },
      },
    },
    categories: {
      data: [
        {
          id: 21,
          attributes: {
            name: "Sneakers",
          },
        },
        {
          id: 22,
          attributes: {
            name: "Casual",
          },
        },
      ],
    },
    sizes: {
      data: [
        {
          id: 31,
          attributes: {
            value: 38,
          },
        },
        {
          id: 32,
          attributes: {
            value: 39,
          },
        },
        {
          id: 33,
          attributes: {
            value: 40,
          },
        },
      ],
    },
  },
};
