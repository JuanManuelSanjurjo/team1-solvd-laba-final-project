"use client";

import { useState } from "react";
import Button from "./Button";
import { ButtonProps as MuiButtonProps } from "@mui/material";
import Image from "next/image";

export default function AiButton({ ...props }: MuiButtonProps) {
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
          <Image src="/logo.svg" alt="Logo" width={22} height={22} />
        )
      }
      {...props}
    >
      {isLoading ? (
        <Image src="/logo-orange.svg" alt="Logo" width={22} height={22} />
      ) : (
        "Use AI suggestion"
      )}
    </Button>
  );
}
