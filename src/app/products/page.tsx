import HomeClient from "./components/HomeClient";
import { auth } from "@/auth";

export default async function Products() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  return <HomeClient userId={userId} />;
}
