"use client";

import { Box, Drawer, Typography } from "@mui/material";
import { useState, useMemo } from "react";
import CardContainer from "@/components/cards/CardContainer";
import PaginationComponent from "@/components/PaginationComponent";
import SkeletonPagination from "@/components/SkeletonPagination";
import { Add, FilterRemove, FilterSearch } from "iconsax-react";
import { useSearchParams } from "next/navigation";
import { getFiltersFromSearchParams } from "@/lib/get-filters-from-search-params";
import { hasActiveFilters } from "@/lib/filter-utils";
import Card from "@/components/cards/Card";
import { FilterSideBar } from "../app/products/components/FiltersSideBar";
import SkeletonCardContainer from "./skeletons/products/SkeletonCardContainer";
import MyProductsEmptyState from "@/components/MyProductsEmptyState";
import { normalizeProductCard } from "@/lib/normalizers/normalize-product-card";
import { PRODUCTS_PER_PAGE } from "@/lib/constants/globals";
import useQueryPagedProducts from "../app/products/hooks/useQueryPageProducts";
import useMediaBreakpoints from "@/hooks/useMediaBreakpoints";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

interface ProductsProps {
  session: Session | null;
  brandOptions: { value: number; label: string }[];
  colorOptions: { value: number; label: string }[];
  sizeOptions: { value: number; label: number }[];
  categoryOptions: { value: number; label: string }[];
}

export default function Products({
  session,
  brandOptions,
  colorOptions,
  sizeOptions,
  categoryOptions,
}: ProductsProps) {
  const [filtersOpen, setFiltersOpen] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);

  const filters = useMemo(
    () => getFiltersFromSearchParams(searchParams),
    [searchParams]
  );
  const searchTerm = useMemo(
    () => searchParams.get("searchTerm"),
    [searchParams]
  );

  const {
    data: products,
    pagination,
    isPending,
  } = useQueryPagedProducts({
    filters,
    pageNumber: page,
    pageSize: PRODUCTS_PER_PAGE,
    searchParams: searchParams.toString(),
    searchTerm,
  });

  function deleteSearchTerm() {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("searchTerm");
    newSearchParams.delete("page");
    router.push(`?${newSearchParams.toString()}`);
  }

  function handleSetPage(page: number) {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", page.toString());
    router.push(`?${newSearchParams.toString()}`);
  }

  const { isMobile, isDesktop } = useMediaBreakpoints();

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
          paginationTotal={pagination?.total}
          hideDrawer={() => {
            setFiltersOpen(!filtersOpen);
          }}
          categoryOptions={categoryOptions}
          colorOptions={colorOptions}
          brandOptions={brandOptions}
          sizeOptions={sizeOptions}
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
                xs: "h3",
                sm: "h3",
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
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            color="text.primary"
          >
            {searchTerm && !isMobile ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    typography: {
                      xs: "h3",
                      md: "h2",
                    },
                  }}
                  color="text.primary"
                >
                  Search results for
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "rgba(150,150,150,0.1)",
                    borderRadius: 1,
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    maxWidth: "100%",
                  }}
                >
                  <Typography
                    title={searchTerm}
                    sx={{
                      typography: {
                        xs: "h3",
                        md: "h2",
                      },
                      paddingInline: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {searchTerm}
                  </Typography>
                  <Add
                    color="rgba(92, 92, 92, 1)"
                    size={24}
                    style={{ transform: "rotate(45deg)", cursor: "pointer" }}
                    onClick={deleteSearchTerm}
                  />
                </Box>
              </Box>
            ) : // ? "Search results for " + "'" + searchTerm + "'"
            hasActiveFilters(filters) ? (
              "Search results"
            ) : (
              " Products List"
            )}
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
              <Box sx={{ display: "flex", maxWidth: "65%" }}>
                {/* <Typography */}
                {/*   variant="body1" */}
                {/*   color="text.secondary" */}
                {/*   marginBottom="8px" */}
                {/* ></Typography> */}
                <Typography
                  variant="h5"
                  color="text.primary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {searchTerm
                    ? `${searchTerm} (${pagination?.total || 0})`
                    : ""}
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
                      textWrap: "nowrap",
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
                    subtitle="Try another search or remove some filters!"
                  />
                </Box>
              ) : (
                <>
                  <CardContainer length={products?.length}>
                    {normalizeProductCard(products || []).map(
                      (product, index) => (
                        <Card
                          session={session}
                          product={product}
                          topAction="cardButtonWishList"
                          overlayAction="cardOverlayAddToCard"
                          key={index}
                          overlay={true}
                        />
                      )
                    )}
                  </CardContainer>
                  {pagination ? (
                    <PaginationComponent
                      pagination={pagination}
                      setPage={handleSetPage}
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
