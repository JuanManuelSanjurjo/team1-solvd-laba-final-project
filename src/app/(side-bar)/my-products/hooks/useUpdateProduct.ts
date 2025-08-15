import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadImages } from "@/lib/strapi/uploadImages";
import { useSession } from "next-auth/react";
import { ProductFormData } from "../add-product/schema";
import { updateProduct } from "@/lib/strapi/updateProduct";
import { deleteImage } from "@/lib/strapi/deleteImage";

export function useUpdateProduct(productId: number) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user.jwt;
  if (!token) throw new Error("User not authenticated (missing token)");

  return useMutation({
    mutationFn: async ({
      data,
      imageFiles,
      existentImages,
      imagesToDelete = [],
    }: {
      data: ProductFormData;
      imageFiles: File[];
      existentImages: number[];
      imagesToDelete?: number[];
    }) => {
      const uploadedIds = imageFiles.length
        ? await uploadImages(imageFiles)
        : [];
      const images = uploadedIds.concat(existentImages);

      const payload = {
        data: { ...data, teamName: "team-1", images },
      };

      await updateProduct(productId, payload, token);

      if (imagesToDelete && imagesToDelete.length > 0) {
        await Promise.all(
          imagesToDelete.map(async (imageId) => {
            try {
              await deleteImage(imageId, token);
            } catch (err) {
              console.error(`Failed to delete image ${imageId}:`, err);
            }
          })
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-products", session?.user.id],
      });
    },
  });
}
