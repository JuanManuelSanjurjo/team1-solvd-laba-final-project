import { useMutation } from "@tanstack/react-query";
import { ProductFormData } from "../schema";
import { uploadImages } from "@/lib/strapi/uploadImages";
import { createProduct } from "@/lib/strapi/uploadProduct";
import { useSession } from "next-auth/react";

export function useCreateProduct() {
  const { data: session } = useSession();
  const token = session?.user.jwt;
  return useMutation({
    mutationFn: async ({
      data,
      imageFiles,
    }: {
      data: ProductFormData;
      imageFiles: File[];
    }) => {
      const uploadedIds = imageFiles.length
        ? await uploadImages(imageFiles)
        : [];
      const payload = {
        data: { ...data, teamName: "team-1", images: uploadedIds },
      };
      await createProduct(payload, token ?? "");
    },
  });
}
