import GithubProvider from "next-auth/providers/github";
import User from "@/models/user";
import UserPremium from "@/models/userPremium";
import UserStats from "@/models/userStats";
import Message from "@/models/message";
import mongoose from "mongoose";
import { connect } from "@/lib/db";

let connectionPromise: Promise<typeof mongoose> | null = null;

async function ensureDbConnection() {
  const readyState = mongoose.connection.readyState;

  if (readyState === 1) {
    return; // Zaten bağlı
  }

  if (readyState === 2) {
    // Bağlanma sürecinde, mevcut promise'i bekle
    if (connectionPromise) {
      await connectionPromise;
    }
  } else {
    // Bağlı değil veya bağlantı kesiliyor, yeni bağlantı başlat
    if (!connectionPromise || readyState === 0 || readyState === 3) {
      connectionPromise = connect();
    }

    await connectionPromise;
  }
}

interface GithubProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  login: string;
  html_url: string;
  avatar_url: string;
}

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    async signIn(params) {
      const { account, profile } = params;
      if (account?.provider === "github" && profile) {
        try {
          await ensureDbConnection();

          const githubProfile = profile as unknown as GithubProfile;
          const existingUser = await User.findOne({ _id: githubProfile.id });

          if (!existingUser) {
            // Create new user with Github ID as _id
            const newUser = await User.create({
              _id: githubProfile.id,
              github_id: githubProfile.id,
              name: githubProfile.name,
              username: githubProfile.login,
              bio: githubProfile.bio,
              email: githubProfile.email,
              github_profile_url: githubProfile.html_url,
              avatar_url: githubProfile.avatar_url,
            });

            // Create UserPremium document
            await UserPremium.create({
              _id: newUser._id,
              premium: false,
              premium_expires_at: null,
              premium_plan: "free",
            });

            // Create UserStats document
            await UserStats.create({
              _id: newUser._id,
              credit: 0,
              view_count: 0,
            });

            // Create welcome message for new user
            await Message.create({
              recipient: newUser._id,
              sender: "Gitcord",
              subject: "Welcome to Gitcord! 🎉",
              content: `Hello ${githubProfile.name || githubProfile.login}! 👋

Welcome to the Gitcord community! Here you can track your GitHub profile, connect with other developers, and enhance your coding journey.

🌟 What you can do:
• Customize your profile and view your statistics
• Message with other developers
• Take your place on the leaderboard
• Discover more with premium features

If you encounter any problems or need help, feel free to reach out to us.
Also, if you have a magic code, you can activate this code from the Settings section.

Good luck! 🚀

The Gitcord Team`,
              isRead: false,
            });
          }

          return true;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
      return true;
    },
    async session(params) {
      const { session, token } = params;
      if (session.user) {
        session.user.id = token.sub as string;
        session.accessToken = token.accessToken as string;
        session.user.isModerator = token.isModerator as boolean;
      }
      return session;
    },
    async jwt(params) {
      const { token, account, trigger } = params;
      if (account) {
        token.accessToken = account.access_token;
      }

      // Fetch user's moderator status when token is created or updated
      if (token.sub && (trigger === "signIn" || trigger === "update")) {
        try {
          await ensureDbConnection();
          const user = await User.findById(token.sub).select("isModerator");
          if (user) {
            token.isModerator = user.isModerator || false;
          }
        } catch (error) {
          console.error("Error fetching moderator status:", error);
          token.isModerator = false;
        }
      }

      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
