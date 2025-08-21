import { auth } from "@/auth";
import HomeClient from "./products/components/HomeClient";

export default async function Home() {
  const session = await auth();

  return <HomeClient session={session} />;
}
