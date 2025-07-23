
import Select from "@/components/FormElements/Select";
import PaymentMethodOption from "@/components/PaymentMethodOption";
import { Card } from "iconsax-react";
import Input from "@/components/FormElements/Input";
import { Box } from "@mui/material";
import ShoeSizeOption from "@/components/ShowSizeOption";

export default function SignIn() {
  const options= [
    {label: "label",  value: 2},
    {label: "label",  value: 1},
  ]

  return (
    <div>
      <h1>Sign In Page</h1>
      <Select label="Label" placeholder="Placeholder" options={options}/>
    
      <Input name="name" errorMessage="sdka" label="label" />

    <Box sx={{display: "flex" } }>
      <PaymentMethodOption icon={Card} label="Card" selected={false} />
      <PaymentMethodOption icon={Card} label="Card" selected={false} />

    </Box>

    <ShoeSizeOption size={40}/>

    </div>
  );
}
