import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RecentlyViewed from "./components/RecentlyViewed";

export const metadata = {
  title: "Recently Viewed",
};

/**
 * RecentlyViewedPage page that displays the user's recently viewed products.
 * Includes options to view products, add to cart, and remove from wishlist.
 *
 * @component
 * @returns {JSX.Element} The rendered recently viewed page with the user's recently viewed products
 */
export default async function RecentlyViewedPage() {
  const session = await auth();

  if (session === null) {
    redirect("/auth/sign-in");
  }

  return <RecentlyViewed session={session} />;
}
