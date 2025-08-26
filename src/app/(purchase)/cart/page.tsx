import { auth } from "@/auth";
import Cart from "./components/Cart";
import { redirect } from "next/navigation";

export default async function CartPage() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  if (!userId) {
    redirect("/auth/log-in");
  }

  await new Promise((res) => setTimeout(res, 3000));

  return <Cart userId={userId} />;
}
