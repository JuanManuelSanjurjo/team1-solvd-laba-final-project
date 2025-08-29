import { auth } from "@/auth";
import Cart from "./components/Cart";
import { redirect } from "next/navigation";

/**
 * Cart page route component that handles authentication and renders the cart.
 * Redirects unauthenticated users to the login page.
 * Passes the authenticated user's ID to the Cart component.
 *
 * @async
 * @function CartPage
 * @returns {Promise<JSX.Element>} The rendered Cart component with user ID
 */
export default async function CartPage() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  if (!userId) {
    redirect("/auth/log-in");
  }

  return <Cart userId={userId} />;
}
