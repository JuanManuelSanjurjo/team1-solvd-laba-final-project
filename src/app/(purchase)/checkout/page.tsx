import { Typography, Box } from "@mui/material";
import PaymentInfo from "./components/PaymentInfo";
import { Grid, Divider } from "@mui/material";
import Input from "@/components/FormElements/Input";
import { InputProps } from "@/types/form";

const personalInfoInputs: InputProps[] = [
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

const shippingInfoInputs: InputProps[] = [
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

export default function Checkout() {
  return (
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
            <Grid key={input.name} size={6}>
              <Input
                name={input.name}
                label={input.label}
                placeholder={input.placeholder}
                required={input.required}
                errorMessage={input.errorMessage}
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
              <Grid key={input.name} size={3}>
                <Input
                  name={input.name}
                  label={input.label}
                  placeholder={input.placeholder}
                  required={input.required}
                  errorMessage={input.errorMessage}
                  type={input.type}
                />
              </Grid>
            ))}

          {shippingInfoInputs
            .filter((item) => item.name === "address")
            .map((input) => (
              <Grid key={input.name} size={12}>
                <Input
                  name={input.name}
                  label={input.label}
                  placeholder={input.placeholder}
                  required={input.required}
                  errorMessage={input.errorMessage}
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
  );
}
