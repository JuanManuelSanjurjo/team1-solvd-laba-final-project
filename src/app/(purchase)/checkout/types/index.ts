import * as z from "zod";

export const personalInfoSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(
      /^(?!\s+$)[A-Za-z\s]+$/,
      "Please, enter a valid name. Only letters are available."
    ),
  surname: z
    .string()
    .min(1, "Surname is required")
    .regex(
      /^(?!\s+$)[A-Za-z\s]+$/,
      "Please, enter a valid surname. Only letters are available."
    ),
  email: z.email("Enter a valid email"),
  phone: z.string().min(7, "Phone is too short"),
});

export const shippingInfoSchema = z.object({
  country: z
    .string()
    .min(1, "Country is required")
    .regex(/^(?!\s+$)[A-Za-z\s]+$/, "Please, enter a valid country."),
  city: z
    .string()
    .min(1, "City is required")
    .regex(/^(?!\s+$)[A-Za-z\s]+$/, "Please, enter a valid city."),
  state: z
    .string()
    .min(1, "State is required")
    .regex(/^(?!\s+$)[A-Za-z\s]+$/, "Please, enter a valid state."),
  zip: z.string().regex(/^[A-Za-z0-9\- ]+$/, "Enter a valid zip/postal code"),
  address: z.string().min(5, "Enter a full address"),
});

export const paymentInfoSchema = z.object({
  cardNumber: z.string().regex(/^\d{13,19}$/, "Enter a valid card number"),
  expDate: z
    .string()
    .trim()
    .regex(/^(0?[1-9]|1[0-2])\/\d{2}$/, "Format must be MM/YY"),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC"),
});

export const checkoutSchema = z.object({
  ...personalInfoSchema.shape,
  ...shippingInfoSchema.shape,
  ...paymentInfoSchema.shape,
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
