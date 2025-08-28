"use client";

import { Typography, Box, Grid, Divider } from "@mui/material";
import Input from "@/components/form-elements/Input";
import { InputProps } from "@/types/form";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/store/cart-store";
import CheckoutSummary from "../../components/CheckoutSummary";
import { CartItem } from "../../cart/types";

import { checkoutSchema, type CheckoutFormValues } from "../types";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { StripePaymentElementOptions } from "@stripe/stripe-js";

/**
 * CheckoutForm component used to handle the full checkout process including:
 * - Personal and shipping information inputs
 * - Stripe payment integration via `PaymentElement`
 * - Form validation using React Hook Form and Zod
 *
 * Submits payment data to Stripe and redirects to a thank-you page on success.
 *
 * @component
 * @param {{ orderId: string }} props - The ID of the current order, used for the return URL after successful payment.
 * @returns {JSX.Element} A complete checkout form with payment, personal, and shipping sections.
 */

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

const personalInfoInputs: CheckoutInputProps[] = [
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

const shippingInfoInputs: CheckoutInputProps[] = [
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

/* Default values */
const defaultValues = {
  name: "John",
  surname: "Doe",
  email: "john.doe@example.com",
  phone: "(555) 123-4567",
  country: "United States",
  city: "New York",
  state: "New York",
  zip: "10001",
  address: "123 Main Street, Apt 4B",
};

export default function CheckoutForm({ userId }: { userId: string }) {
  const byUser = useCartStore((state) => state.byUser);
  const cartItems: CartItem[] = userId ? byUser[userId] ?? [] : [];

  const cartIsEmpty = cartItems.length === 0;

  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const methods = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!stripe || !elements || loading) return;

    setLoading(true);

    try {
      const stripeResponse = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/thank-you`,
          payment_method_data: {
            billing_details: {
              email: data.email,
              name: `${data.name} ${data.surname}`,
              phone: data.phone,
              address: {
                country: data.country,
                city: data.city,
                state: data.state,
                postal_code: data.zip,
                line1: data.address,
              },
            },
          },
        },
      });

      if (stripeResponse.error) {
        setMessage(stripeResponse.error.message ?? "Unexpected error");
        setLoading(false);
      }
    } catch {
      setMessage("Payment confirmation failed. Please try again.");
      setLoading(false);
    }
  };

  const options: StripePaymentElementOptions = {
    layout: {
      type: "tabs",
      defaultCollapsed: false,
    },
  } as const;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          lg: "row",
        },
        paddingInline: "20px",
        marginTop: "80px",
        justifyContent: "space-around",
      }}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              marginTop: "80px",
              display: "flex",
              flexDirection: "column",
              gap: "74px",
              maxWidth: "800px",
              paddingBottom: "74px",
            }}
          >
            <Typography variant="h2">Checkout</Typography>

            <Box component="section">
              <Typography variant="subtitle1" sx={{ marginBottom: "32px" }}>
                Personal info
              </Typography>

              <Grid container spacing={"24px"}>
                {personalInfoInputs.map((input) => (
                  <Grid key={input.name} size={{ xs: 12, sm: 6 }}>
                    <Input
                      {...methods.register(input.name)}
                      label={input.label}
                      placeholder={input.placeholder}
                      required={input.required}
                      errorMessage={
                        errors[input.name as keyof CheckoutFormValues]
                          ?.message || ""
                      }
                      type={input.type}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Divider />
            <Box component="section">
              <Typography variant="subtitle1" sx={{ marginBottom: "32px" }}>
                Shipping info
              </Typography>
              <Grid container spacing={"24px"}>
                {shippingInfoInputs
                  .filter((item) => item.name !== "address")
                  .map((input) => (
                    <Grid key={input.name} size={{ xs: 12, sm: 3 }}>
                      <Input
                        {...methods.register(input.name)}
                        label={input.label}
                        placeholder={input.placeholder}
                        required={input.required}
                        errorMessage={
                          errors[input.name as keyof CheckoutFormValues]
                            ?.message || ""
                        }
                        type={input.type}
                      />
                    </Grid>
                  ))}

                {shippingInfoInputs
                  .filter((item) => item.name === "address")
                  .map((input) => (
                    <Grid key={input.name} size={12}>
                      <Input
                        {...methods.register(input.name)}
                        label={input.label}
                        placeholder={input.placeholder}
                        required={input.required}
                        errorMessage={
                          errors[input.name as keyof CheckoutFormValues]
                            ?.message || ""
                        }
                        type={input.type}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>

            <Divider />

            <Box component="section">
              <Typography variant="subtitle1" sx={{ marginBottom: "32px" }}>
                Payment info
              </Typography>
              <PaymentElement options={options} />
              {message && <Typography color="error">{message}</Typography>}
            </Box>
          </Box>
        </form>
      </FormProvider>

      {!cartIsEmpty && (
        <Box sx={{ marginTop: "80px" }}>
          <CheckoutSummary
            buttonText={loading ? "Processing..." : "Confirm & Pay"}
            buttonAction={handleSubmit(onSubmit)}
            userId={userId}
            disabled={loading || !stripe || !elements}
          />
        </Box>
      )}
    </Box>
  );
}
