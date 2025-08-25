import { Box, Typography } from "@mui/material";
import Link from "next/link";
import CardImage from "./CardImage";
import CardActionWrapperTopRight from "./wrappers/CardActionWrapperTopRight";
import CardActionWrapperCenter from "./wrappers/CardActionWrapperCenter";
import { JSX } from "react";
import cardProduct from "./actions/types";
import CardButtonMenu from "./actions/CardButtonMenu";
import CardButtonWishList from "./actions/CardButtonWishList";
import CardOverlayAddToCart from "./actions/CardOverlayAddToCart";
import CardOverlayDelete from "./actions/CardOverlayDelete";
import { Session } from "next-auth";

type CardProps = {
  session: Session | null;
  product?: cardProduct;
  image?: string;
  topAction?: string;
  overlayAction?: string;
  overlay?: boolean;
  showText?: boolean;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDeletePreview?: () => void;
  onDelete?: () => void;
};

/**
 * Card
 *
 * This component displays either a product (with optional text and actions)
 * or a standalone image. It supports top-right and overlay actions.
 * @param onDelte edit callback.
 * @param onEdit edit callback.
 * @param onDuplicate duplicate callback.
 * @param onDeletePreview delete callback.
 * @param product - Optional product to display with name, price, and description.
 * @param image - Optional image to show if no product is provided.
 * @param topAction - Action to show on top-right corner (e.g., "cardButtonMenu").
 * @param overlayAction - Action to show in the center overlay (e.g., "CardOverlayAddToCard").
 * @param overlay - Currently unused (reserved for future positioning logic).
 * @param showText - Whether to show text details if a product is passed.
 * @returns {JSX.Element}
 */

export default function Card({
  session,
  product,
  image,
  topAction = undefined,
  overlayAction = undefined,
  showText = true,
  onEdit = () => {},
  onDuplicate = () => {},
  onDeletePreview = () => {},
  onDelete = () => {},
}: CardProps): JSX.Element {
  const displayImage = product?.image || image;

  return (
    <Box
      sx={{
        position: "relative",
        transition: "opacity 0.2s ease",
        height: { xs: 210, md: 445 },
        width: {
          xs: 152,
          md: 320,
        },
        display: "flex",
        flexDirection: "column",
        "&:hover ": {
          opacity: 0.8,
        },
        "&:hover .overlay": {
          opacity: 1,
        },
      }}
    >
      <Link href={`/products/${product?.id}`}>
        <CardImage image={displayImage || "No image available"}>
          <>
            {topAction && (
              <CardActionWrapperTopRight
                action={
                  topAction === "cardButtonMenu" ? (
                    <CardButtonMenu
                      product={product!}
                      onEdit={onEdit!}
                      onDelete={onDelete!}
                      onDuplicate={onDuplicate!}
                    />
                  ) : (
                    <CardButtonWishList session={session} product={product!} />
                  )
                }
              />
            )}
            {overlayAction && (
              <CardActionWrapperCenter
                action={
                  overlayAction === "cardOverlayAddToCart" ? (
                    <CardOverlayAddToCart
                      product={{
                        id: product?.id ?? 0,
                        image: product?.image,
                        name: product?.name ?? "",
                        price: product?.price ?? 0,
                        gender: product?.gender,
                      }}
                    />
                  ) : (
                    <CardOverlayDelete onDeletePreview={onDeletePreview!} />
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
                ${product.price}
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
              {product.gender}
              {"'"}s shoes
            </Typography>
          </Box>
        )}
      </Link>
    </Box>
  );
}
