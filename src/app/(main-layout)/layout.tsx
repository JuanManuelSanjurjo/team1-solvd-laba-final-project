import { Header } from "@/components/Header";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header isAuthenticated={true} />
      {children}
    </div>
  );
}
