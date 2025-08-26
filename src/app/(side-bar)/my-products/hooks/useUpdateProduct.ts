import { useMutation } from "@tanstack/react-query";
import { uploadImages } from "@/lib/actions/upload-images";
import { ProductFormData } from "../add-product/types";
import { updateProduct } from "@/lib/actions/update-product";
import { deleteImage } from "@/lib/actions/delete-image";
import { getQueryClient } from "@/lib/get-query-client";
import { Session } from "next-auth";
import { useToastStore } from "@/store/toastStore";

export function useUpdateProduct(
  productId: number,
  session: Session,
  options?: { autoDeleteImages?: boolean } // new optional flag
) {
  const queryClient = getQueryClient();
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

      if (
        options?.autoDeleteImages &&
        imagesToDelete &&
        imagesToDelete.length > 0
      ) {
        await Promise.all(
          imagesToDelete.map(async (imageId) => {
            try {
              await deleteImage(imageId, token);
            } catch {
              useToastStore.getState().show({
                severity: "error",
                message: `Failed to delete image ${imageId}`,
              });
            }
          })
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-products", session?.user.id],
      });
      useToastStore.getState().show({
        severity: "success",
        message: "Product edited succesfully",
      });
    },
    onError: () => {
      useToastStore.getState().show({
        severity: "error",
        message: "Failed to edit product",
      });
    },
  });
}
