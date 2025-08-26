import { useMutation } from "@tanstack/react-query";
import { ProductFormData } from "../types";
import { uploadImages } from "@/lib/actions/upload-images";
import { createProduct } from "@/lib/actions/upload-product";
import { Session } from "next-auth";
import { getQueryClient } from "@/lib/get-query-client";
import { useToastStore } from "@/store/toastStore";

export function useCreateProduct(session: Session) {
  const token = session.user.jwt;
  const queryClient = getQueryClient();

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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-products", session?.user.id],
      });
      useToastStore.getState().show({
        severity: "success",
        message: "Product added successfully!",
      });
    },
    onError: () => {
      useToastStore.getState().show({
        severity: "error",
        message: "Failed to add product",
      });
    },
  });
}
