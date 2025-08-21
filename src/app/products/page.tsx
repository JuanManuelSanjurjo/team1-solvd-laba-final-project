import { auth } from "@/auth";
import Home from "../../components/Products";

export default async function Products() {
  const session = await auth();

  return <Home session={session} />;
}
