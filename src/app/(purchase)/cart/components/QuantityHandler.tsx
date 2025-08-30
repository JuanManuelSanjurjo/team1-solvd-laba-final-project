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
import { useCartStore } from "@/store/cart-store";

type QuantityHandlerProps = {
  quantity: number;
  id: number;
  userId: string;
  size: number;
};

/**
 * Responsive quantity selector component.
 * Displays increment/decrement buttons and current quantity value.
 * On mobile screens, renders as an expandable accordion.
 * On larger screens, renders as an inline layout with label.
 *
 * @component
 * @param {QuantityHandlerProps} props - The component props
 * @param {number} props.quantity - Current quantity of the item
 * @param {number} props.id - Unique identifier for the product
 * @param {string} props.userId - The unique identifier for the user
 * @param {number} props.size - Size of the product
 * @returns {JSX.Element} A responsive UI for handling product quantity adjustments
 */

const QuantityHandler = ({
  quantity,
  id,
  userId,
  size,
}: QuantityHandlerProps) => {
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
          marginBottom: "0",
        }}
      >
        <AccordionSummary
          sx={{
            fontSize: "12px",
            display: "flex",
            fontFamily: "--var(--font-worksans)",
            gap: "4px",
            padding: "0",
            color: "#494949",
            minHeight: "unset",
            margin: "0 !important",
            "&.Mui-expanded": {
              minHeight: "0px",
              margin: "0 !important",
            },
            "& .MuiAccordionSummary-content": {
              margin: "0 !important",
              "&.Mui-expanded": {
                margin: "0 !important",
              },
            },
          }}
          expandIcon={<ArrowDown2 size="12" color="black" />}
        >
          Quantity
        </AccordionSummary>
        <AccordionDetails sx={{ position: "absolute", right: 0, padding: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              backgroundColor: "#ffffff",
              padding: ".5rem",
              borderRadius: ".5rem",
              boxShadow: "4px 4px 10px #49494927",
            }}
          >
            <ProductQuantityButton
              onClick={() => updateQuantity(userId, id, "minus", size)}
              operation="Minus"
            />
            <Typography variant="body1" color="#494949">
              {quantity}
            </Typography>
            <ProductQuantityButton
              onClick={() => updateQuantity(userId, id, "add", size)}
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
        onClick={() => updateQuantity(userId, id, "minus", size)}
        operation="Minus"
      />
      <Typography variant="h4" color="#494949">
        {quantity}
      </Typography>
      <ProductQuantityButton
        onClick={() => updateQuantity(userId, id, "add", size)}
        operation="Add"
      />
      <Typography color="#494949">Quantity</Typography>
    </Box>
  );
};

export default QuantityHandler;
