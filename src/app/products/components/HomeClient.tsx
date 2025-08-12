"use client";

import {
  Box,
  Drawer,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import CardContainer from "@/components/cards/CardContainer";
import PaginationComponent from "@/components/PaginationComponent";
import SkeletonPagination from "@/components/SkeletonPagination";
import { FilterRemove, FilterSearch } from "iconsax-react";
import { useSearchParams } from "next/navigation";
import { getFiltersFromSearchParams } from "@/lib/getFiltersFromSearchParams";
import { hasActiveFilters } from "@/lib/filterUtils";
import Card from "@/components/cards/Card";
import { FilterSideBar } from "./FiltersSideBar";
import SkeletonCardContainer from "./SkeletonCardContainer";
import MyProductsEmptyState from "@/components/MyProductsEmptyState";
import { normalizeProductCard } from "@/lib/normalizers/normalizeProductCard";
import useConditionalQuery from "@/app/products/hooks/useConditionalQuery";

export default function HomeClient() {
  const [filtersOpen, setFiltersOpen] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);

  const searchParams = useSearchParams();
  const filters = useMemo(
    () => getFiltersFromSearchParams(searchParams),
    [searchParams],
  );
  const searchTerm = useMemo(
    () => searchParams.get("searchTerm"),
    [searchParams],
  );

  useEffect(() => {
    setPage(0);
  }, [searchTerm, filters]);

  const {
    data: products,
    pagination,
    isPending,
  } = useConditionalQuery({
    filters,
    page,
    searchParams: searchParams.toString(),
    searchTerm,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const drawerWidth = isDesktop ? 320 : 240;
  const drawerVariant = isMobile ? "temporary" : "persistent";
  const drawerAnchor = isMobile ? "right" : "left";

  return (
    <>
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
            height: "100%",
            overflowY: "auto",
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
            {searchTerm
              ? "Search results for " + "'" + searchTerm + "'"
              : hasActiveFilters(filters)
                ? "Search results"
                : " Products List"}
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
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
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
              xs: "0 5px",
              sm: "0 30px",
              md: "0 40px",
              lg: "0 60px",
            },
          }}
        >
          {isPending ? (
            <SkeletonCardContainer />
          ) : (
            <>
              {products?.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "25vh",
                  }}
                >
                  <MyProductsEmptyState
                    title="No products match this search"
                    subtitle="Try removing some filters!"
                  />
                </Box>
              ) : (
                <>
                  <CardContainer length={products?.length}>
                    {normalizeProductCard(products || []).map(
                      (product, index) => (
                        <Card
                          product={product}
                          topAction="cardButtonWishList"
                          overlayAction="cardOverlayAddToCard"
                          key={index}
                          overlay={true}
                        />
                      ),
                    )}
                  </CardContainer>
                  {pagination ? (
                    <PaginationComponent
                      pagination={pagination}
                      setPage={setPage}
                    />
                  ) : (
                    <SkeletonPagination />
                  )}
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  );
}
