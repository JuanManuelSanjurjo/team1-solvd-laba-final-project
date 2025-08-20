import { auth } from "@/auth";
import HomeClient from "./products/components/HomeClient";

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  return <HomeClient userId={userId} />;
}
