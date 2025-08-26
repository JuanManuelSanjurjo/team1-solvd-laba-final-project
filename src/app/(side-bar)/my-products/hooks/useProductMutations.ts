import { useCreateProduct } from "../add-product/hooks/useCreateProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { Session } from "next-auth";
import { ProductFormData } from "../add-product/types";

export function useProductMutations(session: Session) {
  const createMutation = useCreateProduct(session);

  const createProduct = async ({
    data,
    imageFiles,
    remainingExistentImages = [],
  }: {
    data: ProductFormData;
    imageFiles: File[];
    remainingExistentImages?: number[];
  }) => {
    return createMutation.mutateAsync({
      data,
      imageFiles,
      remainingExistentImages,
    });
  };

  const updateProduct = async ({
    productId,
    data,
    imageFiles,
    existentImages = [],
    imagesToDelete = [],
  }: {
    productId: number;
    data: ProductFormData;
    imageFiles: File[];
    existentImages: number[];
    imagesToDelete?: number[];
  }) => {
    const updateMutation = useUpdateProduct(productId, session);
    return updateMutation.mutateAsync({
      data,
      imageFiles,
      existentImages,
      imagesToDelete,
    });
  };

  return { createProduct, updateProduct };
}
