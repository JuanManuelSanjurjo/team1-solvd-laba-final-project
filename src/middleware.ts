import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      return Boolean(token);
    },
  },
  pages: {
    signIn: "/auth/sign-in",
  },
});

export const config = {
  matcher: [
    "/my-products/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/my-wishlist/:path*",
    "/order-history/:path*",
    "/recently-viewed/:path*",
    "/thank-you/:path*",
    "/update-profile/:path*",
  ],
};
