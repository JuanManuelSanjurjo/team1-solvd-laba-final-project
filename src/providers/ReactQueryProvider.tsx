"use client";

import { getQueryClient } from "@/lib/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";

/**
 * @function
 * @param {Object} props - The props for the component.
 * @param {React.ReactNode} props.children - The children to render.
 * @returns {JSX.Element} The react query provider component.
 *
 * @example
 * const reactQueryProvider = ReactQueryProvider({
 *   children: <App />,
 * });
 */
export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
