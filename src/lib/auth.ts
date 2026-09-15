import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import { authConfig } from "./auth.config";
import { connectDB } from "./mongodb";
import { User } from "@/models/User";

const clientPromise = process.env.MONGODB_URI
  ? new MongoClient(process.env.MONGODB_URI).connect()
  : null;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  ...(clientPromise ? { adapter: MongoDBAdapter(clientPromise) } : {}),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
});
