import { auth } from "@/auth";
import Products from "@/components/Products";

export default async function ProductsPage() {
  const session = await auth();

  return <Products session={session} />;
}
