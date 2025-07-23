"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import OrderHistoryItemRow from "@/app/order-history/components/OrderHistoryItemRow";
import ProductCard from "@/components/ProductCard";
import IconWithDownloadLink from "@/components/IconWithDownloadLink";
import { OrderProduct } from "@/app/order-history/types/order";
import { OrderDetails } from "@/app/order-history/types/order";
import { OrderInfo } from "@/app/order-history/types/order";
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

  const handleChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      sx={{ width: "1480px", backgroundColor: "#FAFAFA" }}
    >
      <AccordionSummary sx={{ height: "56px" }}>
        <OrderHistoryItemRow {...orderInfo} isOpen={expanded} />
      </AccordionSummary>

      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
            p: "16px 24px",
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
          <Typography
            variant="cartText"
            sx={{ color: theme.palette.cartTextColor.secondary }}
          >
            Contacts:{" "}
            <Typography
              variant="cartText"
              sx={{ color: theme.palette.cartTextColor.primary }}
            >
              {details.contacts}
            </Typography>
          </Typography>
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
        {products.map((product, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #e0e0e0",
              p: "16px 24px",
            }}
          >
            <ProductCard {...product} />
            <Typography
              variant="cartText"
              sx={{ color: theme.palette.cartTextColor.secondary }}
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
            <Typography
              variant="cartText"
              sx={{ color: theme.palette.cartTextColor.secondary }}
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
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "space-between",
            borderBottom: "1px solid #e0e0e0",
            p: "16px 24px",
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
              sx={{ color: theme.palette.cartTextColor }}
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
