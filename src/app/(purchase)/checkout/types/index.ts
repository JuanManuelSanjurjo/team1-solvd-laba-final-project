import { InputProps } from "@/types/form";
import * as z from "zod";

/* Inputs */
type CheckoutInputProps = Omit<InputProps, "name"> & {
  name:
    | "name"
    | "surname"
    | "email"
    | "phone"
    | "country"
    | "state"
    | "city"
    | "email"
    | "phone"
    | "address"
    | "zip";
};

export const personalInfoInputs: CheckoutInputProps[] = [
  /* Name */
  {
    name: "name",
    label: "Name",
    placeholder: "Jane",
    required: true,
    errorMessage: "",
    type: "text",
  },

  /* Surname */
  {
    name: "surname",
    label: "Surname",
    placeholder: "Meldrum",
    required: true,
    errorMessage: "",
    type: "text",
  },

  /* Email */
  {
    name: "email",
    label: "Email",
    placeholder: "email@email.com",
    required: true,
    errorMessage: "",
    type: "email",
  },

  /* Phone Number */
  {
    name: "phone",
    label: "Phone number",
    placeholder: "(949) 456-5644",
    required: true,
    errorMessage: "",
    type: "tel",
  },
];

export const shippingInfoInputs: CheckoutInputProps[] = [
  /* Country */
  {
    name: "country",
    label: "Country",
    placeholder: "USA",
    required: true,
    errorMessage: "",
    type: "text",
  },

  /* City */
  {
    name: "city",
    label: "City",
    placeholder: "New York",
    required: true,
    errorMessage: "",
    type: "text",
  },

  /* State */
  {
    name: "state",
    label: "State",
    placeholder: "New York",
    required: true,
    errorMessage: "",
    type: "text",
  },

  /* Zip */
  {
    name: "zip",
    label: "Zip Code",
    placeholder: "92000",
    required: true,
    errorMessage: "",
    type: "text",
  },

  /* Address */
  {
    name: "address",
    label: "Address",
    placeholder: "Street, Apartment, Block",
    required: true,
    errorMessage: "",
    type: "text",
  },
];

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

export const checkoutSchema = z.object({
  ...personalInfoSchema.shape,
  ...shippingInfoSchema.shape,
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
