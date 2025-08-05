"use client";

import { useState } from "react";
import { Stack, Box } from "@mui/material";
import PaymentMethodOption from "./PaymentMethodOption";
import {
  Card,
  Wallet,
  Google,
  TransmitSquare,
  ArrowDown2,
  ArrowUp2,
} from "iconsax-react";
import { IconButton } from "@mui/material";
import Input from "@/components/FormElements/Input";

const PaymentInfo = () => {
  const [selectedId] = useState(1);
  const [showPaymentForm, setShowPaymentForm] = useState(true);

  type PaymentMethod = {
    id: number;
    name: string;
    icon: React.ElementType;
  };

  const paymentMethods = [
    {
      id: 1,
      name: "Card",
      icon: Card,
    },
    {
      id: 2,
      name: "Google Pay",
      icon: Google, //Need to make this icon
    },
    {
      id: 3,
      name: "Cash Apple Pay",
      icon: Wallet,
    },
    {
      id: 4,
      name: "After Payment",
      icon: TransmitSquare,
    },
  ];

  return (
    <Box
      sx={{
        maxWidth: "800px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      }}
    >
      <Stack direction="row" spacing={"12px"}>
        {paymentMethods.map((method: PaymentMethod) => (
          <PaymentMethodOption
            key={method.id}
            selected={selectedId === method.id}
            icon={method.icon}
            label={method.name}
          />
        ))}

        <IconButton
          sx={{
            border: "1px solid #E1E1E1",
            borderRadius: "12px",
            paddingInline: "24px",
            paddingBlock: "38px",
          }}
          onClick={() => setShowPaymentForm(!showPaymentForm)}
        >
          {showPaymentForm ? (
            <ArrowDown2 size={24} color="#292D32" />
          ) : (
            <ArrowUp2 size={24} color="#292D32" />
          )}
        </IconButton>
      </Stack>

      {showPaymentForm && (
        <>
          {/* <Input label="Card number" placeholder="1234 1234 1234 1234" /> */}

          <Stack direction="row" sx={{ width: "100%" }} spacing="24px">
            {/* <Input label="Expiration date" placeholder="MM / YY" /> */}
            {/* <Input label="Security Code" placeholder="CVC" /> */}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default PaymentInfo;
