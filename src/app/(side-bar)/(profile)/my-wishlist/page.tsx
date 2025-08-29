import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Wishlist from "./components/Wishlist";

export const metadata = {
  title: "My Wishlist",
};

/**
 * MyWishlist page that displays the user's wishlist of products.
 * Includes options to view products, add to cart, and remove from wishlist.
 *
 * @component
 * @returns {JSX.Element} The rendered wishlist page with the user's wishlist of products
 */
export default async function MyWishlist() {
  const session = await auth();

  if (session === null) {
    redirect("/auth/sign-in");
  }

  return <Wishlist session={session} />;
}
