"use client";

import { Header } from "@/components/Header";
import { Typography, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Button from "@/components/Button";
import Link from "next/link";

export default function ThankYou() {
  const theme = useTheme();
  return (
    <>
      <Header></Header>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 4, md: 13 }}
        alignItems={{ xs: "center", md: "stretch" }}
        sx={{
          marginTop: {
            xs: "60px",
            lg: "90px",
            xl: "120px",
          },
          marginLeft: {
            xs: "16px",
            lg: "160px",
            xl: "196px",
          },

          marginRight: {
            xs: "16px",
            lg: "256px",
            xl: "294px",
          },
        }}
      >
        <Stack
          direction="column"
          alignItems="flex-start"
          sx={{
            flexGrow: 1,
            width: "100%",
            maxWidth: { md: "767px", xl: "800px" },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "40px", md: "90px", xl: "140px" },
              fontWeight: "900",
              color: theme.palette.text.primary,
              lineHeight: 1,
              whiteSpace: "nowrap",
              flexShrink: 0,
              mt: { xs: "60px", md: "70px", xl: "80px" },
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
                color: theme.palette.text.primary,
              }}
            >
              for your order
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "28px", md: "36px", xl: "48px" },
                fontWeight: "500",
                color: theme.palette.error.main,
              }}
            >
              #9082372
            </Typography>
          </Stack>

          <Typography
            sx={{
              fontSize: { xs: "12px", md: "18px", xl: "24px" },
              fontWeight: "300",
              color: theme.palette.text.secondary,
              mt: { xs: "27px", md: "67px", xl: "77px" },
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
              mt: { xs: "25px", md: "65px", xl: "95px" },
            }}
          >
            <Link href="/order-history">
              <Button
                variant="outlined"
                sx={{
                  width: { xs: "100%", md: "281px" },
                  height: { md: "65px" },
                }}
              >
                View order
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="contained"
                sx={{
                  width: { xs: "100%", md: "281px" },
                  height: { md: "65px" },
                }}
              >
                Continue shopping
              </Button>
            </Link>
          </Stack>
        </Stack>

        <Stack
          direction="column"
          justifyContent={{ lg: "flex-start", xl: "flex-end" }}
          alignItems="center"
          flexGrow={1}
          flexBasis={{ xs: "100%", md: "50%" }}
          display={{ xs: "none", sm: "none", md: "none", lg: "flex" }}
        >
          <Stack
            component="img"
            src="/assets/images/thankyou-image.png"
            alt="delivery-image"
            sx={{
              height: "auto",
              display: "block",
              maxWidth: { xs: "250px", lg: "350px", xl: "493px" },
              mt: { md: "80px", xl: "244px" },
            }}
          />
        </Stack>
      </Stack>
    </>
  );
}
