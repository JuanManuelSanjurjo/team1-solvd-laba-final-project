"use client";

import CardContainer from "@/components/cards/CardContainer";
import Card from "@/components/cards/Card";
import { Box } from "@mui/material";
import { useWishlistStore } from "@/store/wishlist-store";
import ProductsEmptyState from "@/components/ProductsEmptyState";
import { useRouter } from "next/navigation";
import { LogoBlackSvg } from "@/components/LogoBlackSvg";
import { Session } from "next-auth";
import { useCallback } from "react";
import ProfileHeaderTitle from "../../components/ProfileHeaderTitle";
import SkeletonCardContainer from "@/components/skeletons/products/SkeletonCardContainer";
import {
  useClientHydrated,
  useCleanUpGhostProducts,
} from "../../hooks/useCleanupGhostProducts";

/**
 * Wishlist component that displays the user's wishlist of products.
 * Includes options to view products, add to cart, and remove from wishlist.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Session} props.session - The user session object containing user information
 * @returns {JSX.Element} The rendered wishlist page with the user's wishlist of products
 */
export default function Wishlist({ session }: { session: Session }) {
  const router = useRouter();
  const userId = session.user.id;
  const byUser = useWishlistStore((state) => state.byUser);
  const isHydrated = useClientHydrated();
  const removeInactiveProducts = useWishlistStore(
    (state) => state.removeInactiveProducts
  );
  const wishList = byUser[userId] ?? [];

  const visitProducts = useCallback(() => {
    router.push("/products");
  }, [router]);

  const loading = useCleanUpGhostProducts(
    isHydrated ? wishList.map((prod) => prod.id) : [],
    (inactive) => removeInactiveProducts(userId, inactive)
  );

  if (!isHydrated || loading) {
    return (
      <>
        <ProfileHeaderTitle>My wishlist</ProfileHeaderTitle>
        <SkeletonCardContainer></SkeletonCardContainer>
      </>
    );
  }

  return (
    <>
      <ProfileHeaderTitle>My wishlist</ProfileHeaderTitle>
      {wishList.length > 0 ? (
        <CardContainer length={wishList.length}>
          {wishList.map((product) => (
            <Card
              session={session}
              product={product}
              key={product.id}
              topAction="cardButtonWishList"
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
            title="You don't have any products in wishlist yet"
            subtitle="Add products from products page using the heart icon."
            buttonText="Go to products"
            onClick={visitProducts}
            icon={LogoBlackSvg}
          />
        </Box>
      )}
    </>
  );
}
