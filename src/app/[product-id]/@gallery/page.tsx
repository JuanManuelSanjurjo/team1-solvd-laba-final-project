import Gallery from "../components/gallery/Gallery";
import { normalizeImages } from "../types/types";

type Params = {
  "product-id": string;
};

/**
 * getProductImages
 *
 * This function fetches only the product images corresponding to the product ID from the Strapi API.
 *
 * @param {string} id - The product ID.
 * @returns {Promise<ImageData[]>} The product images.
 *
 * @example
 * const images = await getProductImages(params["product-id"]);
 */
async function getProductImages(id: string) {
  try {
    const response = await fetch(
      `https://shoes-shop-strapi.herokuapp.com/api/products/${id}?populate[images][fields][0]=url&populate[images][fields][1]=name`,
      { cache: "no-store" },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch product images");
    }
    const responseData = await response.json();
    return responseData?.data?.attributes?.images || { data: null };
  } catch (error) {
    console.log(error);
  }
}

/**
 * GalleryPage
 *
 * This function fetches the product images and normalizes the data.
 *
 * @param {Params} params - The URL parameters.
 * @returns {JSX.Element} The gallery component.
 */
export default async function GalleryPage({ params }: { params: Params }) {
  const { data } = await getProductImages(params["product-id"]);
  const images = data ? normalizeImages(data) : [];

  const defaultImage = {
    id: 0,
    url: "https://placehold.co/400",
    alt: "default",
  };

  if (images.length === 0) {
    images.push(defaultImage);
  }

  return <Gallery images={images} />;
}
