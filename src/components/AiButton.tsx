"use client";

import { useState } from "react";
import Button from "./Button";
import { ButtonProps as MuiButtonProps } from "@mui/material";

interface AiButtonProps extends MuiButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function AiButton({ onClick, ...props }: AiButtonProps) {
  const [isLoading, setIsLoading] = useState(false); // probably this state will be outside the component in the parent component

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
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
        "@keyframes pulse": {
          from: {
            backgroundColor: "#F7635E1A",
          },
          to: {
            backgroundColor: "#f7635e3a",
          },
        },
      }}
      endIcon={
        isLoading ? null : (
          <img
            src="/logo.svg"
            alt="Logo"
            style={{ width: 22, height: "auto" }}
          />
        )
      }
      {...props}
    >
      {isLoading ? (
        <img
          src="/logo-orange.svg"
          alt="Logo"
          style={{ width: 22, height: "auto" }}
        />
      ) : (
        "Use AI suggestion"
      )}
    </Button>
  );
}
