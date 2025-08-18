"use client";

import { Typography, Box } from "@mui/material";
import PaymentInfo from "./components/PaymentInfo";
import { Grid, Divider } from "@mui/material";
import Input from "@/components/FormElements/Input";
import { InputProps } from "@/types/form";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CheckoutSummary from "../components/CheckoutSummary";
import { useCartStore } from "@/store/cartStore";

import {
  checkoutSchema,
  type CheckoutFormValues,
} from "./validation/checkoutSchema";

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

const defaultValues = {
  name: "",
  surname: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  state: "",
  zip: "",
  address: "",
  cardHolder: "",
  cardNumber: "",
  expDate: "",
  cvc: "",
};

export default function Checkout() {
  const cartItems = useCartStore((state) => state.items);
  const cartIsEmpty = cartItems.length === 0;

  const methods = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: CheckoutFormValues) => {
    console.log("Form Submitted:", data);
  };

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
              <PaymentInfo />
            </Box>
          </Box>
        </form>
      </FormProvider>
      {!cartIsEmpty && (
        <Box sx={{ marginTop: "80px" }}>
          <CheckoutSummary
            buttonText="Confirm & Pay"
            buttonAction={() => handleSubmit(onSubmit)()}
          />{" "}
        </Box>
      )}
    </Box>
  );
}
