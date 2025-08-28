"use client";

import { getQueryClient } from "@/lib/get-query-client";
import { deleteImage } from "@/lib/actions/delete-image";
import { deleteProduct } from "@/lib/actions/delete-product";
import { useMutation } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useToastStore } from "@/store/toastStore";

type DeletePayload = {
  productId: number;
  imageIds?: number[];
};

interface useDeleteProductProps {
  setPage: (page: number) => void;
  currentPage: number;
  productsLength: number;
  session: Session;
}

/**
 * Hook to delete a product (and optionally its images)
 *
 * Integrates with React Query to invalidate the user's product list
 * and uses a toast store to provide success/error feedback.
 *
 * @param {Object} props Hook props
 * @param {Session} props.session Current authenticated user session (contains JWT).
 * @param {(page: number) => void} props.setPage Setter for current pagination page.
 * @param {number} props.currentPage Current page number.
 * @param {number} props.productsLength Number of products currently displayed.
 *
 * @returns {import("@tanstack/react-query").UseMutationResult<void, Error, { productId: number; imageIds?: number[] }>}
 * React Query mutation object for deleting a product.
 */

export function useDeleteProduct({
  session,
  setPage,
  currentPage,
  productsLength,
}: useDeleteProductProps) {
  const token = session?.user?.jwt;
  const queryClient = getQueryClient();

  return useMutation<void, Error, DeletePayload>({
    mutationFn: async ({ productId, imageIds = [] }) => {
      if (!token) throw new Error("User not authenticated (missing token)");

      await deleteProduct(productId, token);

      if (productsLength === 1 && currentPage > 1) {
        setPage(currentPage - 1);
      }

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
      useToastStore.getState().show({
        severity: "success",
        message: "Product deleted succesfully",
      });
    },

    onError: (err) => {
      useToastStore.getState().show({
        severity: "error",
        message: "Failed to delete product",
      });
      console.error("useDeleteProduct - mutation failed:", err);
    },
  });
}
