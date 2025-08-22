import { auth } from "@/auth";
import Checkout from "./components/Checkout";

export default async function CheckoutPage() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  return <Checkout userId={userId} />;



