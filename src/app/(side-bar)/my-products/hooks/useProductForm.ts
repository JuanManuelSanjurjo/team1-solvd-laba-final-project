import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormData, productSchema } from "../add-product/types";

/**
 * Hook: useProductForm
 *
 * Wrapper around `react-hook-form` pre-configured for the product form.
 * It wires Zod validation and provides convenience helpers for toggling sizes.
 *
 * @param {Partial<ProductFormData>} [initialDefaults] - Optional defaults applied to the form's initial values.
 * @returns {object} An object with `react-hook-form` helpers and convenience helpers:
 * - `register, handleSubmit, control, setValue, getValues, setError, reset, errors`
 * - `selectedSizes` (watched `sizes` array)
 * - `toggleSize(size: number)` toggles inclusion of a size id in the `sizes` array
 */

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
      color: initialDefaults?.color ?? 0,
      gender: initialDefaults?.gender ?? 0,
      brand: initialDefaults?.brand ?? 0,
      categories: initialDefaults?.categories ?? 0,
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
