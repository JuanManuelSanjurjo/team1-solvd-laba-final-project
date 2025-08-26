import cardProduct from "@/components/cards/actions/types";

export const MOCK_CARD_PRODUCT: cardProduct = {
  id: 1,
  name: "Mock snicker",
  price: 100,
  image: "mock-image.jpg",
  gender: "Men's shoes",
};

export const MOCK_CARD_PRODUCT_2: cardProduct = {
  id: 2,
  name: "Mock snicker 2",
  price: 150,
  image: "mock-image2.jpg",
  gender: "Women's shoes",
};

export const MOCK_ARRAY_CARD_PRODUCT: cardProduct[] = [
  MOCK_CARD_PRODUCT,
  MOCK_CARD_PRODUCT_2,
  {
    id: 3,
    name: "Mock snicker 3",
    price: 160,
    image: "mock-image3.jpg",
    gender: "Men's shoes",
  },
  {
    id: 4,
    name: "Mock snicker 4",
    price: 170,
    image: "mock-image4.jpg",
    gender: "Women's shoes",
  },
  {
    id: 5,
    name: "Mock snicker 5",
    price: 180,
    image: "mock-image5.jpg",
    gender: "Men's shoes",
  },
  {
    id: 6,
    name: "Mock snicker 6",
    price: 190,
    image: "mock-image6.jpg",
    gender: "Women's shoes",
  },
  {
    id: 7,
    name: "Mock snicker 7",
    price: 200,
    image: "mock-image7.jpg",
    gender: "Men's shoes",
  },
  {
    id: 8,
    name: "Mock snicker 8",
    price: 210,
    image: "mock-image8.jpg",
    gender: "Women's shoes",
  },
  {
    id: 9,
    name: "Mock snicker 9",
    price: 211,
    image: "mock-image9.jpg",
    gender: "Men's shoes",
  },
  {
    id: 10,
    name: "Mock snicker 10",
    price: 212,
    image: "mock-image10.jpg",
    gender: "Women's shoes",
  },
];

export const MOCK_NORMALIZED_PRODUCT = {
  id: 1,
  name: "Mock snicker",
  price: 100,
  images: [{ id: 1, url: "mock-image.jpg", alt: "Snicker-image" }],
  description: "A great snicker",
  gender: "Men's shoes",
  color: "Blue",
  sizes: [{ id: 1, value: 42 }],
};

export const MOCK_USER_ID = "123";

export const MOCK_USER_ID_2 = "456";
