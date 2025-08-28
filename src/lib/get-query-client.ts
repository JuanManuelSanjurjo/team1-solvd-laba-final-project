import { isServer, QueryClient } from "@tanstack/react-query";

/**
 * @function
 * @returns {QueryClient} - A query client instance.
 *
 * @example
 * const queryClient = getQueryClient();
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * @function
 * @returns {QueryClient} - A query client instance.
 *
 * @example
 * const queryClient = getQueryClient();
 */
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
