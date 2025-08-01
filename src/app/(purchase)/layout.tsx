"use client";
import { Box } from "@mui/material";
import CheckoutSummary from "./components/CheckoutSummary";
import { usePathname, useRouter } from "next/navigation";

/**
 * Layout wrapper for the cart and checkout pages.
 * Displays the main content on one side and a fixed `CheckoutSummary` on the other.
 * Adjusts layout responsively between column (mobile) and row (desktop).
 *
 * @component
 * @param {Readonly<{ children: React.ReactNode }>} props - Component children to be rendered alongside the summary.
 *
 * @returns {JSX.Element} A responsive two-column layout with a checkout summary.
 */

const PurchaseLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  const router = useRouter();

  const isCheckoutPage = pathname.includes("/checkout");
  const buttonText = isCheckoutPage ? "Confirm & Pay" : "Checkout";
  const buttonAction = () => {
    if (isCheckoutPage) {
      console.log("Processing Payment");
    } else {
      router.push("/checkout");
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          lg: "row",
        },
        paddingInline: "20px",
        marginTop: "80px",
        justifyContent: "space-around",
      }}
    >
      {children}
      <Box sx={{ marginTop: "80px" }}>
        <CheckoutSummary
          subtotal={140}
          tax={0}
          shipping={0}
          buttonText={buttonText}
          buttonAction={buttonAction}
        />
      </Box>{" "}
    </Box>
  );
};

export default PurchaseLayout;
