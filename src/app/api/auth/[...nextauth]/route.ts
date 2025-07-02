import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// This file exports both the NextAuth handler and authOptions for use in other parts of the app
