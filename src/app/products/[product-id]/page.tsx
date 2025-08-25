import { getProductDetails } from "@/lib/actions/get-product-details";
import { Metadata } from "next";

interface ProductPageProps {
  params: {
    "product-id": string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const productId = params["product-id"];

  try {
    const product = await getProductDetails(productId);

    if (!product) {
      return {
        title: "Product Not Found",
      };
    }

    return {
      title: product.name,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.images?.[0]?.url ? [product.images[0].url] : [],
      },
    };
  } catch {
    return {
      title: "Product Not Found",
    };
  }
}

export default function ProductPage() {
  return null;
}
