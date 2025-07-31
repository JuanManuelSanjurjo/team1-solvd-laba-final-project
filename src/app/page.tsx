"use client";

import {
  Box,
  Drawer,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FilterSideBar } from "./_home/_components/FiltersSideBar";
import { Header } from "@/components/Header";
import { useState } from "react";
import CardContainer from "@/components/cards/CardContainer";
import { FilterRemove, FilterSearch } from "iconsax-react";
import Card from "@/components/cards/Card";
import CardImage from "@/components/cards/CardImage";
import CardContainerImage from "@/components/cards/CardContainerImage";

export default function Home() {
  const [filtersOpen, setFiltersOpen] = useState<boolean>(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // >900px

  const drawerWidth = isDesktop ? 320 : 240;
  const drawerVariant = isMobile ? "temporary" : "persistent";
  const drawerAnchor = isMobile ? "right" : "left";

  const products = [
    {
      id: 1,
      image:
        "https://d2s30hray1l0uq.cloudfront.net/frontend/shoe-photography-featured-image-1024x512.jpg",
      name: "Nike Air Max 97",
      description: "Men's shoes",
      price: "$160",
    },
    {
      id: 2,
      image:
        "https://static.vecteezy.com/system/resources/previews/050/511/817/non_2x/blue-yellow-and-white-running-shoe-in-motion-use-for-athletic-product-banners-sporty-sneaker-posts-and-stylish-covers-isolated-on-transparent-background-png.png",
      name: "Nike Pegasus",
      description: "Men's shoes",
      price: "$140",
    },
    {
      id: 3,
      image:
        "https://www.boafit.com/sites/boafit/files/styles/products_slideshow_275_x_275/public/2025-05/Screenshot%202025-04-24%20at%201.01.36%E2%80%AFPM.png?itok=8kLwUWhU",
      name: "Nike Revolution 7",
      description: "Men's shoes",
      price: "$180",
    },
    {
      id: 4,
      image:
        "https://sendaathletics.com/cdn/shop/files/Ushuaia_Pro_2.0_-_Purple_1.png?v=1752293415&width=533",
      name: "Nike Court Vision",
      description: "Women's shoes",
      price: "$160",
    },
    {
      id: 5,
      image:
        "https://d2s30hray1l0uq.cloudfront.net/frontend/shoe-photography-featured-image-1024x512.jpg",
      name: "Nike Air Max 97",
      description: "Men's shoes",
      price: "$160",
    },
    {
      id: 6,
      image:
        "https://static.vecteezy.com/system/resources/previews/050/511/817/non_2x/blue-yellow-and-white-running-shoe-in-motion-use-for-athletic-product-banners-sporty-sneaker-posts-and-stylish-covers-isolated-on-transparent-background-png.png",
      name: "Nike Pegasus",
      description: "Men's shoes",
      price: "$140",
    },
    {
      id: 7,
      image:
        "https://www.boafit.com/sites/boafit/files/styles/products_slideshow_275_x_275/public/2025-05/Screenshot%202025-04-24%20at%201.01.36%E2%80%AFPM.png?itok=8kLwUWhU",
      name: "Nike Revolution 7",
      description: "Men's shoes",
      price: "$180",
    },
    {
      id: 8,
      image:
        "https://sendaathletics.com/cdn/shop/files/Ushuaia_Pro_2.0_-_Purple_1.png?v=1752293415&width=533",
      name: "Nike Court Vision",
      description: "Women's shoes",
      price: "$160",
    },
  ];

  const images = [
    "https://d2s30hray1l0uq.cloudfront.net/frontend/shoe-photography-featured-image-1024x512.jpg",
    "https://static.vecteezy.com/system/resources/previews/050/511/817/non_2x/blue-yellow-and-white-running-shoe-in-motion-use-for-athletic-product-banners-sporty-sneaker-posts-and-stylish-covers-isolated-on-transparent-background-png.png",
    "https://www.boafit.com/sites/boafit/files/styles/products_slideshow_275_x_275/public/2025-05/Screenshot%202025-04-24%20at%201.01.36%E2%80%AFPM.png?itok=8kLwUWhU",
    "https://sendaathletics.com/cdn/shop/files/Ushuaia_Pro_2.0_-_Purple_1.png?v=1752293415&width=533",
    "https://d2s30hray1l0uq.cloudfront.net/frontend/shoe-photography-featured-image-1024x512.jpg",
    "https://static.vecteezy.com/system/resources/previews/050/511/817/non_2x/blue-yellow-and-white-running-shoe-in-motion-use-for-athletic-product-banners-sporty-sneaker-posts-and-stylish-covers-isolated-on-transparent-background-png.png",
    "https://www.boafit.com/sites/boafit/files/styles/products_slideshow_275_x_275/public/2025-05/Screenshot%202025-04-24%20at%201.01.36%E2%80%AFPM.png?itok=8kLwUWhU",
    "https://sendaathletics.com/cdn/shop/files/Ushuaia_Pro_2.0_-_Purple_1.png?v=1752293415&width=533",
  ];

  return (
    <div>
      <Header isAuthenticated />
      <Drawer
        variant={drawerVariant}
        anchor={drawerAnchor}
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: isMobile ? "auto" : drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isMobile ? "74%" : drawerWidth,
            marginTop: {
              xs: "0px",
              sm: "90px",
              md: "120px",
            },
            boxSizing: "border-box",
            backgroundColor: "rgba(255,255,255,1)",
            borderRight: "none",
          },
        }}
      >
        <FilterSideBar
          hideDrawer={() => {
            setFiltersOpen(!filtersOpen);
          }}
        />
      </Drawer>
      <Box
        sx={{
          width:
            !isMobile && filtersOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
          marginLeft: !isMobile && filtersOpen ? `${drawerWidth}px` : 0,
          transition: "margin 0.3s ease, width 0.3s ease",
          marginTop: {
            xs: "60px",
            sm: "90px",
            md: "120px",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            paddingTop: {
              xs: "28px ",
              sm: "38px",
              md: "48px",
              lg: "68px",
            },
          }}
        >
          <Typography
            component="h1"
            sx={{
              typography: {
                xs: "h2",
                sm: "h5",
                md: "h3",
                lg: "h2",
              },
              padding: {
                xs: "0 20px",
                sm: "0 30px",
                md: "0 40px",
                lg: "0 60px",
              },
              paddingBottom: {
                xs: "12px",
                sm: "0",
              },
              borderBottom: {
                xs: "1px solid #eaecf0",
                sm: "none",
              },
            }}
            color="text.primary"
          >
            Search results
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: {
                xs: "0 20px",
                sm: "0 30px",
                md: "0 40px",
                lg: "0 60px",
              },
              paddingTop: {
                xs: "8px",
              },
            }}
          >
            {isMobile && (
              <Box sx={{}}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  marginBottom="8px"
                >
                  Shoes/Air Force 1
                </Typography>
                <Typography variant="h5" color="text.primary">
                  Air Force 1 (137)
                </Typography>
              </Box>
            )}
            <Box
              onClick={() => {
                setFiltersOpen(!filtersOpen);
              }}
              sx={{ display: "flex", alignItems: "center" }}
            >
              {filtersOpen ? (
                <>
                  <Typography
                    sx={{
                      typography: {
                        xs: "body2",
                        sm: "body2",
                        md: "h4",
                      },
                    }}
                    color="text.secondary"
                  >
                    Hide Filters
                  </Typography>
                  <FilterRemove
                    color="rgba(92, 92, 92, 1)"
                    style={{ width: isMobile ? 12 : 24, marginLeft: "8px" }}
                    type="outline"
                  />
                </>
              ) : (
                <>
                  <Typography
                    sx={{
                      typography: {
                        xs: "body2",
                        sm: "body2",
                        md: "h4",
                      },
                    }}
                    color="text.secondary"
                  >
                    Filters
                  </Typography>
                  <FilterSearch
                    color="rgba(92, 92, 92, 1)"
                    style={{ width: 24, marginLeft: "8px" }}
                    type="outline"
                  />
                </>
              )}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            padding: {
              xs: "0 20px",
              sm: "0 30px",
              md: "0 40px",
              lg: "0 60px",
            },
          }}
        >
          <CardContainer
            products={products}
            topAction="cardButtonMenu"
            overlayAction="CardOverlayAddToCard"
          />

          <CardContainer
            products={products}
            topAction="cardButtonWishList"
            isDragAndDropEnable
          />
        </Box>

        {/* <CardContainerImage
          images={images}
          overlayAction="CardOverlayDelete"
          isDragAndDropEnable
        ></CardContainerImage> */}
      </Box>
    </div>
  );
}
