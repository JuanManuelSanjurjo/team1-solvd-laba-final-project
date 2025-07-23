import { Box, Theme } from "@mui/material";
import Image from "next/image";
import { ReactNode } from "react";

export default function AsideImage({
  imageUrl,
  alt,
  children,
}: {
  imageUrl: string;
  alt: string;
  children?: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "block", // default hidden
        position: "relative",
        flex: "0 0 50%",
        height: "100%",
      }}
    >
      <Image
        style={{ objectFit: "cover" }}
        quality={100}
        fill
        src={imageUrl}
        alt={alt}
      ></Image>
      {children}
    </Box>
  );
}
