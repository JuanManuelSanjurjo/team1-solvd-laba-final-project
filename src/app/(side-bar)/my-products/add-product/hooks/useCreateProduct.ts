import { useMutation } from "@tanstack/react-query";
import { ProductFormData } from "../types";
import { uploadImages } from "@/lib/actions/upload-images";
import { createProduct } from "@/lib/actions/upload-product";
import { Session } from "next-auth";

export function useCreateProduct(session: Session) {
  const token = session.user.jwt;

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
