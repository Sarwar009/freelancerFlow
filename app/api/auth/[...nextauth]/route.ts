import NextAuth, { AuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";

// Type-safe auth options
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const client = await clientPromise;
        const db = client.db("freelancerflow");

        const user = await db.collection("users").findOne({ email: credentials.email });
        if (!user) return null;

        const isValid = await compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        // Only return fields that you want in the session
        return { id: user._id.toString(), name: user.name, email: user.email, plan: user.plan };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const jwtToken = token as JWT & { id?: string; plan?: string };

      if (user) {
        const client = await clientPromise;
        const db = client.db("freelancerflow");
        const email = user.email;

        if (email) {
          const existing = await db.collection("users").findOne({ email });
          if (!existing) {
            const inserted = await db.collection("users").insertOne({
              name: user.name || "",
              email,
              plan: "free",
              createdAt: new Date(),
            });
            jwtToken.id = inserted.insertedId.toString();
            jwtToken.plan = "free";
          } else {
            jwtToken.id = existing._id.toString();
            jwtToken.plan = existing.plan || "free";
          }
        }
      }

      return jwtToken;
    },
    async session({ session, token }) {
      const jwtToken = token as JWT & { id?: string; plan?: string };
      if (session.user) {
        type ExtendedUser = typeof session.user & { id?: string; plan?: string };
        const user = session.user as ExtendedUser;
        user.id = jwtToken.id as string;
        user.plan = jwtToken.plan as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt", // ✅ correctly typed
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };