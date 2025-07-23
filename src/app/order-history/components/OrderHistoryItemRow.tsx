import { Box, Typography } from "@mui/material";
import OrderStatusLabel from "@/app/order-history/components/OrderStatusLabel";
import { OrderStatus } from "@/app/order-history/types/order";
import { useTheme } from "@mui/material/styles";

type OrderHistoryItemRowProps = {
  orderNumber: string;
  orderDate: string;
  productCount: number;
  totalAmount: string;
  status: OrderStatus;
  isOpen?: boolean;
};

/**
 * Renders a summary row for a user's order, including order number, date, product count, total amount, and current status.
 * Useful for displaying a list of orders in a history view
 * @component
 *
 * @param orderNumber - The order identification number
 * @param orderDate - The date the order was place
 * @param productCount - Number of products in the order
 * @param totalAmount - The total price of the order
 * @param status - The status of the order: 'shipped', 'cancelled', or 'received'.
 * @param isOpen - (Optional) Whether the order is expanded; controls the arrow icon in OrderStatusLabel.
 * @returns {JSX.Element}
 * @example
 * <OrderHistoryItemRow orderNumber='N°987654' orderDate='18.07.2025' productCount={3} totalAmount='220$' status='cancelled'></OrderHistoryItemRow>
 * <OrderHistoryItemRow orderNumber='N°987655' orderDate='19.07.2025' productCount={2} totalAmount='100$' status='shipped'></OrderHistoryItemRow>
 * <OrderHistoryItemRow orderNumber='N°987656' orderDate='19.07.2025' productCount={5} totalAmount='350$' status='received'></OrderHistoryItemRow>
 */
function OrderHistoryItemRow({
  orderNumber,
  orderDate,
  productCount,
  totalAmount,
  status,
  isOpen = false,
}: OrderHistoryItemRowProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "1480px",
        heigth: "56px",
        p: "16px 24px",
        boxSizing: "border-box",
        backgroundColor: "#FAFAFA",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "1268px",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography
            variant="cartText"
            sx={{ color: theme.palette.cartTextColor.primary }}
          >
            {orderNumber}
          </Typography>
          <Typography
            variant="cartText"
            sx={{ color: theme.palette.cartTextColor.secondary }}
          >
            {orderDate}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography
            variant="cartText"
            sx={{ color: theme.palette.cartTextColor.secondary }}
          >
            Products{" "}
            <Typography
              component="span"
              variant="cartText"
              sx={{ color: theme.palette.cartTextColor.primary }}
            >
              {productCount}
            </Typography>
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="cartText"
            sx={{ color: theme.palette.cartTextColor.secondary }}
          >
            Summary:{" "}
            <Typography
              component="span"
              variant="cartText"
              sx={{ color: theme.palette.cartTextColor.secondary }}
            >
              {totalAmount}
            </Typography>
          </Typography>
        </Box>
      </Box>

      <Box>
        <OrderStatusLabel status={status} isOpen={isOpen} />
      </Box>
    </Box>
  );
}

export default OrderHistoryItemRow;
