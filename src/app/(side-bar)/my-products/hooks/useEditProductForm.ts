import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MyProduct } from "@/types/product";
import { Session } from "next-auth";
import { urlToFile } from "@/lib/url-utils";
import { ProductFormData, productSchema } from "../add-product/types";
import { useUpdateProduct } from "./useUpdateProduct";
import { useCreateProduct } from "../add-product/hooks/useCreateProduct";

type Mode = "edit" | "duplicate";

interface UseEditProductFormParams {
  product: MyProduct;
  session: Session;
  mode: Mode;
  onSuccess?: () => void;
}

interface UseEditProductFormReturn extends UseFormReturn<ProductFormData> {
  imageFiles: File[];
  setImageFiles: (files: File[]) => void;
  existentImages: string[];
  setExistentImages: (previews: string[]) => void;
  toggleSize: (size: number) => void;
  submit: () => Promise<void> | void; // already wrapped with handleSubmit
  selectedSizes: number[] | undefined;
}

export function useEditProductForm({
  product,
  session,
  mode,
  onSuccess,
}: UseEditProductFormParams): UseEditProductFormReturn {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      color: product.color.id,
      gender: product.gender.id,
      brand: product.brand.id,
      price: product.price,
      categories: product.categories[0].id,
      description: product.description,
      sizes: product?.sizes?.map((s) => s.id),
      userID: 0,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    watch,
    formState: { errors },
  } = form;

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existentImages, setExistentImages] = useState<string[]>(
    product.images ? product.images.map((image) => image.url) : []
  );

  const { mutateAsync: updateProductMutate } = useUpdateProduct(
    product.id,
    session
  );
  const { mutateAsync: createProductMutate } = useCreateProduct(session);

  const selectedSizes = watch("sizes");

  const toggleSize = (size: number) => {
    const currentSizes = selectedSizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    setValue("sizes", newSizes);
  };

  const onSubmit = async (data: ProductFormData) => {
    const userID = parseInt(session?.user.id ?? "0", 10);

    const remainingExistentImages = product.images
      ? product.images
          .filter((image) => existentImages.includes(image.url))
          .map((image) => image.id)
      : [];

    const imagesToDelete =
      product.images &&
      product.images
        .map((img) => img.id)
        .filter((id) => !remainingExistentImages.includes(id));

    if (mode === "edit") {
      try {
        await updateProductMutate({
          data: { ...data, userID },
          imageFiles,
          existentImages: remainingExistentImages,
          imagesToDelete,
        });
        onSuccess?.();
      } catch (err) {
        console.error("Failed to update product in hook:", err);
      }
    } else {
      try {
        let filesToUpload: File[] = [...imageFiles];

        if (product.images?.length) {
          const imagesToKeep = product.images.filter((img) =>
            existentImages.includes(img.url)
          );

          if (imagesToKeep.length) {
            const duplicatedFiles = await Promise.all(
              imagesToKeep.map((img) => urlToFile(img.url))
            );
            filesToUpload = [...filesToUpload, ...duplicatedFiles];
          }
        }

        await createProductMutate({
          data: { ...data, userID },
          imageFiles: filesToUpload,
        });
        onSuccess?.();
      } catch (err) {
        console.error("Failed to create (duplicate) product in hook:", err);
      }
    }
  };

  const submit = handleSubmit(onSubmit);

  return {
    ...form,
    imageFiles,
    setImageFiles,
    existentImages,
    setExistentImages,
    toggleSize,
    submit,
    selectedSizes,
  } as UseEditProductFormReturn;
}
