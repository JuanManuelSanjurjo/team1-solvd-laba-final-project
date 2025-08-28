"use client";
import Card from "@/components/cards/Card";
import CardContainer from "@/components/cards/CardContainer";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import { Box } from "@mui/material";
import { useCallback } from "react";
import ProductsEmptyState from "@/components/ProductsEmptyState";
import { useRouter } from "next/navigation";
import { LogoBlackSvg } from "@/components/LogoBlackSvg";
import { Session } from "next-auth";
import ProfileHeaderTitle from "../../components/ProfileHeaderTitle";
import {
  useClientHydrated,
  useCleanUpGhostProducts,
} from "../../hooks/useCleanupGhostProducts";
import SkeletonCardContainer from "@/components/skeletons/products/SkeletonCardContainer";

/**
 * RecentlyViewed component that displays the user's recently viewed products.
 * Includes options to view products, add to cart, and remove from wishlist.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Session} props.session - The user session object containing user information
 * @returns {JSX.Element} The rendered recently viewed page with the user's recently viewed products
 */
export default function RecentlyViewed({ session }: { session: Session }) {
  const router = useRouter();
  const userId = session.user.id;
  const byUser = useRecentlyViewedStore((state) => state.byUser);
  const isHydrated = useClientHydrated();
  const removeInactiveProducts = useRecentlyViewedStore(
    (state) => state.removeInactiveProducts
  );

  const recentlyViewed = byUser[userId] ?? [];

  const visitProducts = useCallback(() => {
    router.push("/products");
  }, [router]);

  const loading = useCleanUpGhostProducts(
    isHydrated ? recentlyViewed.map((prod) => prod.id) : [],
    (inactive) => removeInactiveProducts(userId, inactive)
  );

  if (!isHydrated || loading) {
    return (
      <>
        <ProfileHeaderTitle>Recently Viewed</ProfileHeaderTitle>
        <SkeletonCardContainer></SkeletonCardContainer>
      </>
    );
  }

  return (
    <>
      <ProfileHeaderTitle>Recently Viewed</ProfileHeaderTitle>
      {recentlyViewed.length > 0 ? (
        <CardContainer length={recentlyViewed.length}>
          {recentlyViewed.map((product) => (
            <Card
              session={session}
              product={product}
              key={product.id}
              overlayAction="cardOverlayAddToCart"
              topAction="addToWishList"
            />
          ))}
        </CardContainer>
      ) : (
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
            title="You haven't viewed any products yet"
            subtitle="View available products in the products page."
            buttonText="Go to products"
            onClick={visitProducts}
            icon={LogoBlackSvg}
          />
        </Box>
      )}
    </>
  );
}
