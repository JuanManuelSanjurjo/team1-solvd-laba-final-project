import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Wishlist from "./components/Wishlist";

export const metadata = {
  title: "My Wishlist",
};

export default async function MyWishlist() {
  const session = await auth();

  if (session === null) {
    redirect("/auth/sign-in");
  }

  return <Wishlist session={session} />;
}
