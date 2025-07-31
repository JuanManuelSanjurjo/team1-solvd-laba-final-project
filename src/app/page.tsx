import { Suspense } from "react";
import HomeClient from "./_home/_components/HomeClient";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeClient />
    </Suspense>
  );
}
