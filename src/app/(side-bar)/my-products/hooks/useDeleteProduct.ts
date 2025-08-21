"use client";

import { getQueryClient } from "@/lib/get-query-client";
import { deleteImage } from "@/lib/actions/delete-image";
import { deleteProduct } from "@/lib/actions/delete-product";
import { useMutation } from "@tanstack/react-query";
import { Session } from "next-auth";

type DeletePayload = {
  productId: number;
  imageIds?: number[];
};

export function useDeleteProduct(session: Session) {
  const token = session?.user?.jwt;
  const queryClient = getQueryClient();

  return useMutation<void, Error, DeletePayload>({
    mutationFn: async ({ productId, imageIds = [] }) => {
      if (!token) throw new Error("User not authenticated (missing token)");

      await deleteProduct(productId, token);

      if (imageIds.length > 0) {
        await Promise.all(
          imageIds.map(async (imageId) => {
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

    onError: (err) => {
      console.error("useDeleteProduct - mutation failed:", err);
    },
  });
}
