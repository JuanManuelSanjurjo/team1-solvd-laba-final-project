import {
  useTheme,
  Box,
  useMediaQuery,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ProductQuantityButton from "./ProductQuantityButton";
import { ArrowDown2 } from "iconsax-react";
import { useCartStore } from "@/store/cartStore";

type QuantityHandlerProps = {
  quantity: number;
  id: number;
  userId: string;
};

/**
 * Responsive quantity selector component.
 * Displays a pair of increment/decrement buttons and the current quantity value.
 *
 * On mobile screens, it renders as an expandable accordion.
 * On larger screens, it renders as an inline layout with label.
 *
 * @component
 * @param {number} quantity - Current quantity of the item.
 *
 * @returns {JSX.Element} A responsive UI for handling product quantity adjustments.
 */

const QuantityHandler = ({ quantity, id, userId }: QuantityHandlerProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  if (isMobile) {
    return (
      <Accordion
        sx={{
          boxShadow: "none",
          background: "none",
          width: "fit-content",
          marginBottom: "1rem",
        }}
      >
        <AccordionSummary
          sx={{
            fontSize: "12px",
            display: "flex",
            gap: "4px",
            padding: "0",
            color: "#494949",
            minHeight: "unset",
            "&.Mui-expanded": {
              minHeight: "0px",
            },
          }}
          expandIcon={<ArrowDown2 size="12" color="black" />}
        >
          Quantity
        </AccordionSummary>
        <AccordionDetails
          sx={{ position: "absolute", right: 0, paddingInline: 0 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
            }}
          >
            <ProductQuantityButton
              onClick={() => updateQuantity(userId, id, "minus")}
              operation="Minus"
            />
            <Typography variant="body1" color="#494949">
              {quantity}
            </Typography>
            <ProductQuantityButton
              onClick={() => updateQuantity(userId, id, "add")}
              operation="Add"
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "9px",
        paddingRight: "17px",
        borderRight: "1px solid #8B8E93",
      }}
    >
      <ProductQuantityButton
        onClick={() => updateQuantity(userId, id, "minus")}
        operation="Minus"
      />
      <Typography variant="h4" color="#494949">
        {quantity}
      </Typography>
      <ProductQuantityButton
        onClick={() => updateQuantity(userId, id, "add")}
        operation="Add"
      />
      <Typography variant="h4" color="#494949">
        Quantity
      </Typography>
    </Box>
  );
};

export default QuantityHandler;
