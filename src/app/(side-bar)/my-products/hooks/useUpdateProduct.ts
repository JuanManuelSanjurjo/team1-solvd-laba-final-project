import { useMutation } from "@tanstack/react-query";
import { uploadImages } from "@/lib/actions/upload-images";
import { ProductFormData } from "../add-product/types";
import { updateProduct } from "@/lib/actions/update-product";
import { deleteImage } from "@/lib/actions/delete-image";
import { getQueryClient } from "@/lib/get-query-client";
import { Session } from "next-auth";
import { useToastStore } from "@/store/toastStore";

/**
 * Hook: useUpdateProduct
 *
 * Handles updating a product. Uploads newly added images, composes the final images array (uploaded IDs + existent IDs),
 * calls the update API, and schedules deletion of any removed images.
 *
 * @param {Session} session - Authentication session containing a JWT in `session.user.jwt`.
 * @returns {Mutation} A React Query mutation (call `mutate` or `mutateAsync` to run it).
 */

export function useUpdateProduct(session: Session) {
  const queryClient = getQueryClient();
  const token = session?.user.jwt;
  if (!token) throw new Error("User not authenticated (missing token)");

  return useMutation({
    mutationFn: async ({
      productId,
      data,
      imageFiles,
      existentImages,
      imagesToDelete = [],
    }: {
      productId: number;
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
