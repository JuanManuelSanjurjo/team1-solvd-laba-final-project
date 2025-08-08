import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadImages } from "@/lib/strapi/uploadImages";
import { useSession } from "next-auth/react";
import { ProductFormData } from "../add-product/schema";
import { updateProduct } from "@/lib/strapi/updateProduct";

export function useUpdateProduct(productId: number) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user.jwt;
  return useMutation({
    mutationFn: async ({
      data,
      imageFiles,
      existentImages,
    }: {
      data: ProductFormData;
      imageFiles: File[];
      existentImages: number[];
    }) => {
      const uploadedIds = imageFiles.length
        ? await uploadImages(imageFiles)
        : [];
      const images = uploadedIds.concat(existentImages);

      const payload = {
        data: { ...data, teamName: "team-1", images },
      };

      await updateProduct(productId, payload, token ?? "");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-products", session?.user.id],
      });
    },
  });
}
