import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormData, productSchema } from "../add-product/types";

export function useProductForm(initialDefaults?: Partial<ProductFormData>) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      color: (initialDefaults?.color as any) ?? undefined,
      gender: (initialDefaults?.gender as any) ?? undefined,
      brand: (initialDefaults?.brand as any) ?? undefined,
      categories: (initialDefaults?.categories as any) ?? undefined,
      price: initialDefaults?.price ?? 0,
      description: initialDefaults?.description ?? "",
      sizes: initialDefaults?.sizes ?? [],
      userID: initialDefaults?.userID ?? 0,
      ...initialDefaults,
    },
  });

  const selectedSizes = watch("sizes");

  const toggleSize = (size: number) => {
    const currentSizes = selectedSizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s: number) => s !== size)
      : [...currentSizes, size];
    setValue("sizes", newSizes);
  };

  return {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    reset,
    errors,
    selectedSizes,
    toggleSize,
  };
}
