import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Account, User as NextAuthUser } from "next-auth";
import { connectMongoDB } from "@/lib/mongoose";
import UserModel from "../../../../models/user"; // renamed to avoid conflict

interface SignInCallbackParams {
  user: NextAuthUser;
  account: Account | null;
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signOut: '/', 
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }: SignInCallbackParams) {
      console.log("User:", user);
      console.log("Account:", account);

      try {
        await connectMongoDB();

        // Check if the user already exists in the DB
        const existingUser = await UserModel.findOne({ email: user.email });

        if (!existingUser && account?.provider === "google") {
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
            }),
          });

          if (!res.ok) {
            console.error("Failed to create user:", await res.text());
            return false;
          }
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user }: { token: any; user?: NextAuthUser }) {
      if (user) {
        const dbUser = await UserModel.findOne({ email: user.email });
        if (dbUser) {
          token.userId = dbUser._id.toString(); // Add MongoDB _id to token
        }
      }
      return token;
    },

    // ✅ 3. session – expose it to client
    async session({ session, token }: { session: any; token: any }) {
      if (token?.userId) {
        session.user.id = token.userId; // Add _id to session.user
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { authOptions };
export { handler as GET, handler as POST };





