import { LogoBlackSvg } from "@/components/LogoBlackSvg";
import ProductsEmptyState from "@/components/ProductsEmptyState";
import { Box } from "@mui/material";
import { Metadata } from "next";
import ProfileHeaderTitle from "../components/ProfileHeaderTitle";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchOrders } from "@/lib/actions/fetch-orders";
import HistoryOrderAccordion from "./components/HistoryOrderAccordion";
import { normalizeStripeStatusToOrderStatus } from "@/lib/normalizers/normalize-stripe-status-order";
import { OrderProduct } from "./types";
import { CartItem } from "@/app/(purchase)/cart/types";

export const metadata: Metadata = {
  title: "Order History",
};

type RetrievedItemsStripe = OrderProduct & {
  image: string;
};

/**
 * OrderHistory page that displays the user's order history.
 * Includes options to view order details, track order status, and refund orders.
 *
 * @component
 * @returns {JSX.Element} The rendered order history page with the user's order history
 */

export default async function OrderHistory() {
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in");
  }

  const { data: orders } = await fetchOrders();

  const orderInfo = orders.map((item) => ({
    orderInfo: {
      orderNumber: item.id,
      orderDate: String(item.created),
      productCount: item.metadata.items
        ? JSON.parse(item.metadata.items).length
        : item.metadata.itemsLength,
      totalAmount: String(item.amount / 100),
      status: normalizeStripeStatusToOrderStatus(item.status),
    },
    details: {
      delivery: item.billing_details.address?.line1 || "",
      contacts: `${item.billing_details.name || ""}, ${
        item.billing_details.phone || ""
      }, ${item.billing_details.email || ""}`,
      payment: item.payment_method_details?.type || "",
      discount: "0$",
    },
    products: item.metadata.items
      ? JSON.parse(item.metadata.items).map((item: RetrievedItemsStripe) => ({
          imageUrl: item.image,
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        }))
      : Object.entries(item.metadata)
          .map(([key, value]) => {
            if (key.includes("item-")) {
              const item = JSON.parse(value) as CartItem;
              return {
                imageUrl: item.image,
                name: item.name,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
              };
            }
            return null;
          })
          .filter(Boolean),
  }));

  return (
    <>
      <ProfileHeaderTitle>Order History</ProfileHeaderTitle>
      {orderInfo.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <ProductsEmptyState
            title="You don't have any orders yet"
            subtitle="Start shooping checkout products available!"
            icon={LogoBlackSvg}
          />
        </Box>
      ) : (
        <>
          {orderInfo.map((item) => (
            <HistoryOrderAccordion
              key={item.orderInfo.orderNumber}
              orderInfo={item.orderInfo}
              details={item.details}
              products={item.products}
            />
          ))}
        </>
      )}
    </>
  );
}
