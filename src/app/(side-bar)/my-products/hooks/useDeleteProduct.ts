"use client";
import { deleteImage } from "@/lib/strapi/deleteImage";
import { deleteProduct } from "@/lib/strapi/deleteProduct";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type DeletePayload = {
  productId: number;
  imageIds?: number[];
};

export function useDeleteProduct() {
  const { data: session } = useSession();
  const token = session?.user?.jwt;
  const queryClient = useQueryClient();

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
