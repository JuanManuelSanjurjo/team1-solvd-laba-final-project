import { useMutation } from "@tanstack/react-query";
import { ProductFormData } from "../schema";
import { uploadImages } from "@/lib/strapi/upload-images";
import { createProduct } from "@/lib/strapi/upload-product";
import { useSession } from "next-auth/react";

export function useCreateProduct() {
  const { data: session } = useSession();
  const token = session?.user.jwt;
  return useMutation({
    mutationFn: async ({
      data,
      imageFiles,
      remainingExistentImages = [],
    }: {
      data: ProductFormData;
      imageFiles: File[];
      remainingExistentImages?: number[];
    }) => {
      const uploadedIds = imageFiles.length
        ? await uploadImages(imageFiles)
        : [];
      const images = uploadedIds.concat(remainingExistentImages);
      const payload = {
        data: { ...data, teamName: "team-1", images },
      };
      await createProduct(payload, token ?? "");
    },
  });
}
