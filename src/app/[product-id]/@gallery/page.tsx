import Gallery from "../components/gallery/Gallery";
import { normalizeImages } from "../types/types";

type Params = {
  "product-id": string;
};

async function getProductImages(id: string) {
  try {
    const response = await fetch(
      `https://shoes-shop-strapi.herokuapp.com/api/products/${id}?populate[images][fields][0]=url&populate[images][fields][1]=name`,
      { cache: "no-store" },
    );
    const responseData = await response.json();
    return responseData.data.attributes.images;
  } catch (error) {
    console.log(error); // placeholder for error handling
  }
}

export default async function GalleryPage({ params }: { params: Params }) {
  const { data } = await getProductImages(params["product-id"]);
  const images = normalizeImages(data);

  return <Gallery images={images} />;
}
