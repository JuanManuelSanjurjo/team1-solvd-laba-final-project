import { NormalizedProduct } from "@/types/product-types";
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
