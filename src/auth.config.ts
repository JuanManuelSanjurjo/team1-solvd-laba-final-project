import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

const REMEMBER_ME_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds
const DEFAULT_SESSION_DURATION = 24 * 60 * 60; // 24 hours in seconds

interface SignInResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

interface SignInError {
  status: number;
  name: string;
  message: string;
  details: Record<string, unknown>;
}

interface ErrorResponse {
  data: null;
  error: SignInError;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "boolean" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const response = await fetch(`${process.env.API_URL}/auth/local`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identifier: credentials.identifier,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            const errorData = data as ErrorResponse;
            throw new Error(errorData.error.message || "Authentication failed");
          }

          const signInData = data as SignInResponse;
          return {
            id: signInData.user.id.toString(),
            name: signInData.user.username,
            email: signInData.user.email,
            jwt: signInData.jwt,
            rememberMe: credentials.rememberMe === "true",
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.jwt = user.jwt;
        token.rememberMe = user.rememberMe;
        token.maxAge = user.rememberMe
          ? REMEMBER_ME_DURATION
          : DEFAULT_SESSION_DURATION;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.jwt = token.jwt as string;
      }
      return session;
    },
    async authorized({ auth }) {
      return Boolean(auth);
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: REMEMBER_ME_DURATION,
  },
} satisfies NextAuthConfig;
