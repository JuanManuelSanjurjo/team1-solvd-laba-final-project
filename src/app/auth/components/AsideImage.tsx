import { Box } from "@mui/material";
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
        display: "block",
        position: "relative",
        flex: "0 0 50%",
        height: "100%",
      }}
    >
      <Image
        style={{ objectFit: "cover" }}
        quality={100}
        data-testid="aside-image"
        fill
        src={imageUrl}
        alt={alt}
      ></Image>
      {children}
    </Box>
  );
}
