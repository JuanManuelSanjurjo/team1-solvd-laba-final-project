import { Box, Typography } from "@mui/material";
import OrderStatusLabel from "./OrderStatusLabel";
import { OrderStatus } from "@/app/(side-bar)/(profile)/order-history/types";
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
    <Box //main box
      sx={{
        display: "grid",
        width: "100%",
        p: { xs: "16px", sm: "16px 24px" },
        boxSizing: "border-box",
        backgroundColor: "#FAFAFA",
        borderBottom: "1px solid #e0e0e0",
        gap: { xs: 2, sm: 3, md: 4 },
        gridTemplateColumns: "1fr auto",
        fontSize: { xs: "12px", sm: "14px" },
        alignItems: { xs: "flex-start", sm: "center" },
      }}
    >
      <Box // OrderDate. Products and summary box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: {
            xs: "flex-start",
            sm: "space-between",
          },
          alignItems: { xs: "flex-start", sm: "center" },
          flexGrow: 1,
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Box // box for order number-date
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            gap: { xs: 0.5, sm: 1 },
            alignItems: { xs: "flex-start", sm: "center" },
            justifySelf: "flex-start",
          }}
        >
          <Typography
            variant="cartText"
            sx={{
              color: theme.palette.cartTextColor.primary,
              wordBreak: "break-word",
            }}
          >
            {orderNumber}
          </Typography>
          <Typography
            variant="cartText"
            sx={{
              color: theme.palette.cartTextColor.secondary,
            }}
          >
            {orderDate}
          </Typography>
        </Box>

        <Box //box product count
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            gap: 0.5,
            alignItems: "center",
          }}
        >
          <Typography
            variant="cartText"
            sx={{
              color: theme.palette.cartTextColor.secondary,
              wordBreak: "break-word",
            }}
          >
            Products{" "}
            <Typography
              component="span"
              variant="cartText"
              sx={{
                color: theme.palette.cartTextColor.primary,
              }}
            >
              {productCount}
            </Typography>
          </Typography>
        </Box>

        <Box //box total
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            gap: 0.5,
            alignItems: "flex-end",
            justifySelf: "flex-end",
          }}
        >
          <Typography
            variant="cartText"
            sx={{
              color: theme.palette.cartTextColor.secondary,
              wordBreak: "break-word",
            }}
          >
            Summary:{" "}
            <Typography
              component="span"
              variant="cartText"
              sx={{
                color: theme.palette.cartTextColor.primary,
              }}
            >
              {totalAmount}
            </Typography>
          </Typography>
        </Box>
      </Box>

      <Box //box order status
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "flex-end", md: "flex-end" },
          justifySelf: "flex-end",
        }}
      >
        <OrderStatusLabel status={status} isOpen={isOpen} />
      </Box>
    </Box>
  );
}

export default OrderHistoryItemRow;
