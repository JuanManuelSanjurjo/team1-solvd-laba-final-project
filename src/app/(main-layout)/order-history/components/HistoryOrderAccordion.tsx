"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import OrderHistoryItemRow from "./OrderHistoryItemRow";
import ProductCard from "@/components/ProductCard";
import IconWithDownloadLink from "@/components/IconWithDownloadLink";
import { OrderProduct } from "../types/order";
import { OrderDetails } from "../types/order";
import { OrderInfo } from "../types/order";
import { useTheme } from "@mui/material/styles";

type HistoryOrderAccordionProps = {
  orderInfo: OrderInfo;
  details: OrderDetails;
  products: OrderProduct[];
};

/**
 * Renders an expandable accordion for a specific user order,
 * showing a summary row, delivery/payment/contacts info,
 * a list of ordered products with quantity and price,
 * and a download link with discount display.
 *
 *
 * @param orderInfo - General information about the order (order number, date, status, etc.).
 * @param details - Additional details of the order such as delivery method, contacts, and payment method.
 * @param products - Array of products included in the order, each with its own quantity and price.
 * @example
 * <HistoryOrderAccordion
 *    orderInfo={{orderNumber: "N°987657", orderDate: "19-07-2025", ...}}
 *    orderDetails={{delivery: "Meest, #134-45 London", contacts: contacts: '...', payment: '...'}}
 *    products={[imageUrl: "/assets/product-img.png", name: "Nike Air Max 270", ...]}>
 */

const HistoryOrderAccordion = ({
  orderInfo,
  details,
  products,
}: HistoryOrderAccordionProps) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const sectionHorizontalPadding = { xs: "16px", sm: "24px" };
  const sectionVerticalPadding = "16px";

  const handleChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      sx={{
        backgroundColor: "#FAFAFA",
        boxShadow: "none",
        margin: 0,
        fontSize: { xs: "12px", sm: "14px" },
        "&.Mui-expanded": {
          minHeight: "unset",
          margin: "0",
          borderRadius: 0,
          "& .MuiAccordionSummary-root": {
            borderBottom: "none",
            minHeight: "unset",
          },
        },
        // Styling when NOT expanded (collapsed)
        "&:not(.Mui-expanded)": {
          borderRadius: 0,
        },
      }}
    >
      <AccordionSummary
        sx={{
          minHeight: { xs: "unset", sm: "56px" },
          width: "100%",
          p: 0,
          display: "flex",
          alignItems: "center",
          "&.Mui-expanded": {
            margin: 0,
            width: "100%",
          },
          "& .MuiAccordionSummary-content": {
            margin: 0,
            padding: 0,
          },
        }}
        expandIcon={null}
      >
        <OrderHistoryItemRow {...orderInfo} isOpen={expanded} />
      </AccordionSummary>

      <AccordionDetails
        sx={{
          display: "grid",
          p: 0,
          width: "100%",
          fontSize: { xs: "12px", sm: "14px" },
        }}
      >
        <Box // box delivery contacts and payment
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: {
              xs: "flex-start",
              sm: "center",
              md: "center",
            },
            alignItems: "center",
            borderBottom: `1px solid ${theme.palette.divider}`,
            p: `${sectionVerticalPadding} ${sectionHorizontalPadding.xs}`,
            [theme.breakpoints.up("sm")]: {
              p: `${sectionVerticalPadding} ${sectionHorizontalPadding.sm}`,
            },
            gap: "8px",
            width: "100%",
            "& > div": {
              flexGrow: 1,
              flexShrink: 1,
            },
          }}
        >
          <Box //delivery box
            sx={{
              flexShrink: 0,
              textAlign: {
                sm: "right",
                md: "right",
              },
            }}
          >
            <Typography
              variant="cartText"
              sx={{ color: theme.palette.cartTextColor.secondary }}
            >
              Delivery:{" "}
              <Typography
                component="span"
                variant="cartText"
                sx={{ color: theme.palette.cartTextColor.primary }}
              >
                {details.delivery}
              </Typography>{" "}
            </Typography>
          </Box>

          <Box //contacts box
            sx={{
              flexShrink: 0,
              minWidth: { xs: "100%", sm: "120px", md: "unset" },
              textAlign: {
                sm: "center",
                md: "center",
              },
            }}
          >
            <Typography
              variant="cartText"
              sx={{
                color: theme.palette.cartTextColor.secondary,
                whiteSpace: {
                  xs: "normal",
                  sm: "normal",
                  md: "nowrap",
                },
              }}
            >
              Contacts:{" "}
              <Typography
                variant="cartText"
                sx={{ color: theme.palette.cartTextColor.primary }}
              >
                {details.contacts}
              </Typography>
            </Typography>
          </Box>

          <Box
            sx={{
              flexShrink: 0,
              minWidth: { xs: "100%", sm: "120px", md: "unset" },
              textAlign: {
                sm: "left",
                md: "left",
              },
            }}
          >
            <Typography
              variant="cartText"
              sx={{ color: theme.palette.cartTextColor.secondary }}
            >
              Payment:{" "}
              <Typography
                variant="cartText"
                sx={{ color: theme.palette.cartTextColor.primary }}
              >
                {details.payment}
              </Typography>
            </Typography>
          </Box>
        </Box>
        {products.map((product, index) => (
          <Box //box productcard quantity an price row2
            key={index}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr", //
                sm: "minmax(120px, 1.5fr) 1fr 1fr",
                md: "minmax(150px, 1.5fr) 1fr 1fr",
              },
              gap: { xs: 1, sm: 2 },
              alignItems: "center",
              borderBottom: `1px solid ${theme.palette.divider}`,
              p: `${sectionVerticalPadding} ${sectionHorizontalPadding.xs}`,
              [theme.breakpoints.up("sm")]: {
                p: `${sectionVerticalPadding} ${sectionHorizontalPadding.sm}`,
              },
            }}
          >
            <Box // box product card
              sx={{
                justifySelf: {
                  xs: "center",
                  sm: "flex-start",
                  md: "flex-start",
                },
                width: "100%",
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              <ProductCard {...product} />
            </Box>

            <Typography //quantity
              variant="cartText"
              sx={{
                color: theme.palette.cartTextColor.secondary,
                justifySelf: { xs: "center", sm: "flex-end", md: "flex-end" },
                mt: { xs: 1, sm: 0 },
                textAlign: {
                  sm: "right",
                  md: "right",
                },
              }}
            >
              Quantity:{" "}
              <Typography
                variant="cartText"
                component="span"
                sx={{ color: theme.palette.cartTextColor.primary }}
              >
                {product.quantity}
              </Typography>
            </Typography>

            <Typography //price
              variant="cartText"
              sx={{
                color: theme.palette.cartTextColor.secondary,
                justifySelf: { xs: "center", sm: "flex-end", md: "flex-end" },
                mt: { xs: 0.5, sm: 0 },
              }}
            >
              Price:{" "}
              <Typography
                variant="cartText"
                component="span"
                sx={{ color: theme.palette.cartTextColor.primary }}
              >
                {product.price}
              </Typography>
            </Typography>
          </Box>
        ))}
        <Box // box pdf invoice discount
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row", md: "row" },
            alignItems: { xs: "center", sm: "center" },
            justifyContent: {
              xs: "center",
              sm: "space-between",
              md: "space-between",
            },
            borderBottom: `1px solid ${theme.palette.divider}`,
            p: `${sectionVerticalPadding} ${sectionHorizontalPadding.xs}`,
            [theme.breakpoints.up("sm")]: {
              p: `${sectionVerticalPadding} ${sectionHorizontalPadding.sm}`,
            },
          }}
        >
          <IconWithDownloadLink></IconWithDownloadLink>
          <Typography
            variant="cartText"
            sx={{ color: theme.palette.cartTextColor.secondary }}
          >
            Discount:{" "}
            <Typography
              component="span"
              variant="cartText"
              sx={{ color: theme.palette.cartTextColor.primary }}
            >
              18$
            </Typography>
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default HistoryOrderAccordion;
