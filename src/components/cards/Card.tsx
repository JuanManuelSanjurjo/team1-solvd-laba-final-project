import { Box, Typography } from "@mui/material";
import CardImage from "./CardImage";
import CardActionWrapperTopRight from "./wrappers/CardActionWrapperTopRight";
import CardActionWrapperCenter from "./wrappers/CardActionWrapperCenter";
import { JSX } from "react";
import { Product } from "@/types/product";
import { Car } from "iconsax-react";
import CardButtonMenu from "./actions/CardButtonMenu";
import CardButtonWishList from "./actions/CardButtonWishList";
import CardOverlayAddToCart from "./actions/CardOverlayAddToCart";
import CardOverlayDelete from "./actions/CardOverlayDelete";

type CardProps = {
  product?: Product;
  image?: string;
  topAction?: string;
  overlayAction?: string;
  overlay?: boolean;
  showText?: boolean;
};

/**
 * Card
 *
 * This component displays either a product (with optional text and actions)
 * or a standalone image. It supports top-right and overlay actions.
 *
 * @param product - Optional product to display with name, price, and description.
 * @param image - Optional image to show if no product is provided.
 * @param topAction - Action to show on top-right corner (e.g., "cardButtonMenu").
 * @param overlayAction - Action to show in the center overlay (e.g., "CardOverlayAddToCard").
 * @param overlay - Currently unused (reserved for future positioning logic).
 * @param showText - Whether to show text details if a product is passed.
 * @returns {JSX.Element}
 */

export default function Card({
  product,
  image,
  topAction = undefined,
  overlayAction = undefined,
  showText = true,
}: CardProps): JSX.Element {
  const displayImage = product?.image || image;

  return (
    <Box
      sx={{
        position: "relative",
        "&:hover .overlay": {
          opacity: 1,
        },
        height: { xs: 210, md: 445 },
        // width: {
        //   xs: 152,
        //   md: 320,
        // },
        width: {
          xs: "calc(50% - 8px)", // 2 por fila con 16px gap
          sm: "calc(33.33% - 16px)", // 3 por fila
          md: "calc(25% - 18px)", // 4 por fila
        },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardImage image={displayImage!!}>
        <>
          {topAction && (
            <CardActionWrapperTopRight
              action={
                topAction === "cardButtonMenu" ? (
                  <CardButtonMenu product={product!} />
                ) : (
                  <CardButtonWishList product={product!} />
                )
              }
            />
          )}

          {overlayAction && (
            <CardActionWrapperCenter
              action={
                overlayAction === "CardOverlayAddToCard" ? (
                  <CardOverlayAddToCart />
                ) : (
                  <CardOverlayDelete />
                )
              }
            />
          )}
        </>
      </CardImage>
      {product && showText && (
        <Box sx={{ mt: 1, flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: "100%",
              textOverflow: "ellipsis",
              fontSize: {
                sx: 10,
                md: 22,
              },
            }}
          >
            <Typography
              variant="subtitle1"
              title={"name of the product"}
              noWrap
              fontWeight={500}
              sx={{ fontSize: "inherit" }}
            >
              {product.name}
            </Typography>
            <Typography variant="subtitle1" fontWeight={500}>
              {product.price}
            </Typography>
          </Box>

          <Typography
            variant="body1"
            align="left"
            color={"#5C5C5C"}
            fontWeight={500}
            sx={{
              maxWidth: "100%",
              wrap: "no-wrap",
              textOverflow: "ellipsis",
              fontSize: {
                sx: 9,
                md: 18,
              },
            }}
          >
            {product.description}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
