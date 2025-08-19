"use client";

import { useState, JSX } from "react";
import { Stack, Box, Typography } from "@mui/material";
import PaymentMethodOption from "./PaymentMethodOption";
import Input from "@/components/form-elements/Input";
import { useFormContext } from "react-hook-form";
import { CheckoutFormValues } from "../types";

import {
  Card,
  Wallet,
  Google,
  TransmitSquare,
  ArrowDown2,
  ArrowUp2,
} from "iconsax-react";
import { IconButton } from "@mui/material";

/**
 * PaymentInfo component that allows users to select and fill out payment details.
 * Supports multiple payment methods such as Card, Google Pay, Cash App Pay, and After Payment.
 * Only the "Card" method displays an interactive form with input fields for now.
 * Other methods currently show a "Not available" message for now.
 *
 * Includes a toggle button to collapse or expand the payment form section.
 *
 * @component
 * @returns {JSX.Element} A payment method selector with optional input fields.
 */

const PaymentInfo = (): JSX.Element => {
  const [selectedId, setSelectedId] = useState(1);
  const [showPaymentForm, setShowPaymentForm] = useState(true);
  const {
    formState: { errors },
  } = useFormContext<CheckoutFormValues>();

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
      name: "Cash App Pay",
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
      <Stack direction={{ sm: "row", xs: "column" }} spacing={"12px"}>
        {paymentMethods.map((method: PaymentMethod) => (
          <PaymentMethodOption
            key={method.id}
            selected={selectedId === method.id}
            icon={method.icon}
            label={method.name}
            onSelect={() => {
              setSelectedId(method.id);
            }}
          />
        ))}

        <IconButton
          sx={{
            border: "1px solid #E1E1E1",
            borderRadius: "12px",
            paddingInline: { sm: "24px", xs: "10px" },
            paddingBlock: { sm: "38px", xs: "10px" },
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
          {selectedId === 1 && (
            <>
              <Input
                errorMessage={errors.cardNumber?.message || ""}
                type="text"
                name="cardNumber"
                label="Card number"
                placeholder="1234 1234 1234 1234"
              />

              <Stack direction="row" sx={{ width: "100%" }} spacing="24px">
                <Input
                  errorMessage={errors.expDate?.message || ""}
                  type="text"
                  name="expDate"
                  label="Expiration date"
                  placeholder="MM / YY"
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length >= 3) {
                      value = value.slice(0, 2) + "/" + value.slice(2, 4);
                    }
                    e.target.value = value;
                  }}
                />
                <Input
                  errorMessage={errors.cvc?.message || ""}
                  type="text"
                  name="cvc"
                  label="Security Code"
                  placeholder="CVC"
                />
              </Stack>
            </>
          )}

          {selectedId === 2 && (
            <Box>
              <Typography variant="body1">Not available</Typography>
            </Box>
          )}

          {selectedId === 3 && (
            <Box>
              <Typography variant="body1">Not available</Typography>
            </Box>
          )}

          {selectedId === 4 && (
            <Box>
              <Typography variant="body1">Not available</Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default PaymentInfo;
