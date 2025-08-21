import HomeClient from "@/components/Products";
import { auth } from "@/auth";

export default async function Products() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  return <HomeClient userId={userId} session={session} />;
}
