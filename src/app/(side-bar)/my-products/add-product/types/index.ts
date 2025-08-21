import { z } from "zod";

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
