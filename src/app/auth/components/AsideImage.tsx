import { Box } from "@mui/material";
import Image from "next/image";
import { ReactNode } from "react";

/**
 * AsideImage component that displays an image in the aside section of the authentication page.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} props.imageUrl - The URL of the image to be displayed
 * @param {string} props.alt - The alt text for the image
 * @param {ReactNode} props.children - Optional child elements to be rendered inside the image container
 * @returns {JSX.Element} The rendered aside image component
 */
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
