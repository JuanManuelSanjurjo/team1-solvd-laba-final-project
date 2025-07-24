"use client";

import { JSX, useState } from "react";
import Button from "./Button";
import { ButtonProps as MuiButtonProps } from "@mui/material";
import Image from "next/image";

/**
 * AiButton is a custom button component built on top of the MUI Button.
 *
 * It conditionally shows a loading animation and swaps its content based on the loading state.
 * During loading, it shows a pulsing background and a spinning logo.
 *
 * @component
 * @param {MuiButtonProps} props - Inherits all Material UI Button props.
 * @returns {JSX.Element}
 * @example
 * <AiButton onClick={handleAction} />
 */
export default function AiButton({ ...props }: MuiButtonProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false); // probably this state will be outside the component in the parent component

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // remove this setTimeout when implementing
  };

  return (
    <Button
      onClick={handleClick}
      sx={{
        background: isLoading
          ? "#F7635E1A"
          : "linear-gradient(to right, #FE645E, #CD3C37)",
        color: "#fff",
        "&:hover": {
          textDecoration: "underline",
        },
        padding: "6px 12px",
        height: "45.25px",
        animation: isLoading ? "pulse 1s infinite alternate" : "none",
      }}
      endIcon={
        isLoading ? null : (
          <Image
            src="/assets/logo/logo.svg"
            alt="Logo"
            width={22}
            height={22}
          />
        )
      }
      {...props}
    >
      {isLoading ? (
        <Image
          src="/assets/logo/logo-orange.svg"
          alt="Logo"
          width={22}
          height={22}
        />
      ) : (
        "Use AI suggestion"
      )}
    </Button>
  );
}
