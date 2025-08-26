"use client";

import { JSX } from "react";
import Button from "./Button";
import { ButtonProps as MuiButtonProps } from "@mui/material";
import Image from "next/image";

interface AiButtonProps extends MuiButtonProps {
  isLoading?: boolean;
  onGenerate?: () => void;
  label: string;
}

export default function AiButton({
  isLoading = false,
  onGenerate,
  label,
  ...props
}: AiButtonProps): JSX.Element {
  return (
    <Button
      onClick={onGenerate}
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
            src={"/assets/logo/logo.svg"}
            alt="Logo"
            width={22}
            height={22}
          />
        )
      }
      {...props}
    >
      {isLoading ? (
        <Image src="/assets/logo/logo.svg" alt="Logo" width={22} height={22} />
      ) : (
        <>{label}</>
      )}
    </Button>
  );
}
