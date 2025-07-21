import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  TruckFast,
  CloseCircle,
  TickCircle,
  ArrowDown2,
  ArrowUp2,
} from "iconsax-react";
import { OrderStatus } from "@/app/order-history/types/order";

type OrderStatusLabelProps = {
  status: OrderStatus;
  isOpen?: boolean;
  width?: string | number;
  height?: string | number;
};

const statusConfigMap: Record<
  OrderStatus,
  { color: string; icon: () => React.ReactNode }
> = {
  shipped: {
    color: "#8C9196",
    icon: () => <TruckFast size="20" color="#8C9196" variant="Outline" />,
  },
  cancelled: {
    color: "#CD3C37",
    icon: () => <CloseCircle size="20" color="#CD3C37" variant="Outline" />,
  },
  received: {
    color: "#3D9D41",
    icon: () => <TickCircle size="20" color="#3D9D41" variant="Outline" />,
  },
};

const Container = styled(Box)({
  display: "flex",
  alignItems: "center",
  height: "24px",
  cursor: "pointer",
});

/**
 * Renders the visual status of an order with its corresponding icon and color.
 * Displays one of the following statuses: `shipped`, `cancelled`, or `received`.
 * An arrow icon is also shown depending on whether the component is open.
 *
 * @component
 *
 * @param status - The order status. One of: 'shipped', 'cancelled', or 'received'.
 * @param isOpen - Optional. If true, shows the arrow pointing up. Defaults to false.
 * @param width - Optional width of the component container.
 * @param height - Optional height of the component container.
 * @returns {JSX.Element}
 * @example
 *  <StatusLabel status="shipped" isOpen width="160px" height="24px" />
 * @example
 * <StatusLabel status="cancelled" width="164px" height="24px" />
 * @example
 * <StatusLabel status="received" isOpen={false} width="164px" height="24px" />
 */

function OrderStatusLabel({
  status,
  isOpen = false,
  width,
}: OrderStatusLabelProps) {
  const { color, icon } = statusConfigMap[status];

  return (
    <Container
      sx={{
        width,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box
        data-testid="status-icon"
        sx={{ ml: "32px", display: "flex", alignItems: "center", gap: "8px" }}
      >
        {icon()}
        <Typography
          variant="cartText"
          sx={{
            color: color,
          }}
        >
          {capitalize(status)}
        </Typography>
      </Box>
      <Box
        data-testid="arrow-icon"
        data-icon-direction={isOpen ? "up" : "down"}
      >
        {isOpen ? (
          <ArrowUp2 size="24" variant="Outline" color="#8C9196" />
        ) : (
          <ArrowDown2 size="24" variant="Outline" color="#8C9196" />
        )}
      </Box>
    </Container>
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default OrderStatusLabel;
