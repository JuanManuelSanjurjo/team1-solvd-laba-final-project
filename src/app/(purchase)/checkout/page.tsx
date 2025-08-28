import { auth } from "@/auth";
import Checkout from "./components/Checkout";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    redirect("/auth/sign-in");
  }

  return <Checkout session={session} />;
}
