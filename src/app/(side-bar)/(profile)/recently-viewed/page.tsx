import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RecentlyViewed from "./components/RecentlyViewed";

export const metadata = {
  title: "Recently Viewed",
};

export default async function RecentlyViewedPage() {
  const session = await auth();

  if (session === null) {
    redirect("/auth/sign-in");
  }

  return <RecentlyViewed session={session} />;
}
