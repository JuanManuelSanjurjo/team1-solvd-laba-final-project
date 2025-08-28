import { z } from "zod";

/**
 * Zod schema for validating product form data.
 * Ensures all required fields are present, correctly typed, and meet specific constraints.
 *
 * Fields:
 * - `name`: Non-empty string representing the product name.
 * - `color`: Numeric ID representing the selected color.
 * - `categories`: Numeric ID representing the selected category.
 * - `gender`: Numeric ID representing the gender category.
 * - `brand`: Numeric ID representing the brand.
 * - `description`: Non-empty string containing the product description.
 * - `price`: Positive number greater than 0.
 * - `sizes`: Array of at least one numeric size.
 * - `userID`: Numeric ID of the user creating the product.
 */

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  color: z.number().refine((val) => typeof val === "number", {
    message: "Color is required",
  }),
  categories: z.number().refine((val) => typeof val === "number", {
    message: "Category is required",
  }),
  gender: z.number().refine((val) => typeof val === "number", {
    message: "Gender is required",
  }),
  brand: z.number().refine((val) => typeof val === "number", {
    message: "Brand is required",
  }),
  description: z.string().min(1, "Description is required"),
  price: z
    .number()
    .refine((val) => typeof val === "number", {
      message: "Price is required",
    })
    .positive("Price must be greater than 0"),
  sizes: z.array(z.number()).min(1, "At least one size must be selected"),
  userID: z.number().refine((val) => typeof val === "number", {
    message: "User id is required",
  }),
});

export type ProductFormData = z.infer<typeof productSchema>;
