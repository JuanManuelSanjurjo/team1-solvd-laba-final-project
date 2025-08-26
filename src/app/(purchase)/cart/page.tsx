import { auth } from "@/auth";
import Cart from "./components/Cart";

export default async function CartPage() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  return <Cart userId={userId} />;
}
