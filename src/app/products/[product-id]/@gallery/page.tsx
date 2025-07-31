import Gallery from "../components/gallery/Gallery";
import { normalizeImages } from "@/lib/normalizers/product-normalizers";
import { getProductImages } from "@/lib/strapi/get-product-images";

type Params = {
  "product-id": string;
};

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
