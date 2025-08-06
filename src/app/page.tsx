import { Suspense } from "react";
import HomeClient from "./products/components/HomeClient";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeClient />
    </Suspense>
  );
}
