import { Typography, Stack, Box } from "@mui/material";
import Button from "@/components/Button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import checkOrderAuthor from "@/lib/actions/check-order-author";

export const metadata = {
  title: "Thank You",
};

/**
 * ThankYou component that displays a thank-you message after a successful order placement.
 * Includes a link to return to the home page.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Promise<{ payment_intent: string }>} props.searchParams - A promise that resolves to the search parameters, including the order ID
 * @returns {JSX.Element} The rendered thank-you page with a thank-you message and a link to return to the home page
 */
export default async function ThankYou({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent: string }>;
}) {
  const session = await auth();
  const { payment_intent: orderId } = await searchParams;

  if (!orderId || !session) {
    redirect("/checkout");
  }

  const isOrderValid = await checkOrderAuthor(orderId, session);

  if (!isOrderValid) {
    redirect("/checkout");
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          gap: "60px",
          padding: { xs: "180px 20px", md: "160px" },
        }}
      >
        <Stack
          direction="column"
          alignItems="center"
          flexGrow={1}
          display="flex"
          sx={{
            order: { xs: 1, md: 2 },
          }}
        >
          <Stack
            component="img"
            src="/assets/images/thankyou-image.png"
            alt="delivery-image"
            sx={{
              height: "auto",
              display: "block",
              maxWidth: { xs: "200px", sm: "300px", lg: "350px", xl: "493px" },
            }}
          />
        </Stack>

        <Box
          sx={{
            display: "flex",
            alignItems: "start",
            flexDirection: "column",
            gap: { xs: "20px", md: "80px" },
            flexGrow: 1,
            width: "100%",
            order: { xs: 2, md: 1 },
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "40px", md: "90px", xl: "140px" },
                fontWeight: "900",
                color: "text.primary",
                lineHeight: 1,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              THANK YOU
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                whiteSpace: "nowrap",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "28px", md: "36px", xl: "48px" },
                  fontWeight: "300",
                  fontStyle: "italic",
                  color: "text.primary",
                }}
              >
                for your order
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "28px", md: "36px", xl: "48px" },
                  fontWeight: "500",
                  color: "error.main",
                  width: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={orderId}
              >
                {orderId}
              </Typography>
            </Stack>
          </Box>

          <Typography
            sx={{
              fontSize: { xs: "12px", md: "18px", xl: "24px" },
              fontWeight: "300",
              color: "text.secondary",
            }}
          >
            Your order has been received and is currently being processed. You
            will receive an email confirmation with your order details shortly.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3.625}
            sx={{
              width: "100%",
            }}
          >
            <Button
              component={Link}
              href="/order-history"
              variant="outlined"
              sx={{
                width: { xs: "100%", md: "281px" },
                height: { md: "65px" },
              }}
            >
              View order
            </Button>
            <Button
              component={Link}
              href="/products"
              variant="contained"
              sx={{
                width: { xs: "100%", md: "281px" },
                height: { md: "65px" },
              }}
            >
              Continue shopping
            </Button>
          </Stack>
        </Box>
      </Box>
    </>
  );
}
