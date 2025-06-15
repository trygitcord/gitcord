import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { AuthOptions } from "next-auth";
import User from "@/models/user";
import UserPremium from "@/models/userPremium";
import UserStats from "@/models/userStats";
import { connect } from "@/lib/db";

interface GithubProfile {
    id: string;
    name: string;
    email: string;
    bio: string;
    login: string;
    html_url: string;
    avatar_url: string;
}

export const authOptions: AuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            authorization: {
                params: {
                    scope: 'read:user user:email repo',
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "github" && profile) {
                try {
                    await connect();

                    const githubProfile = profile as GithubProfile;
                    const existingUser = await User.findOne({ github_id: githubProfile.id });

                    if (!existingUser) {
                        // Create new user
                        const newUser = await User.create({
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
                            premium_plan: 'free'
                        });

                        // Create UserStats document
                        await UserStats.create({
                            _id: newUser._id,
                            credit: 0,
                            view_count: 0
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
        async session({ session, token, user }) {
            if (session.user) {
                session.user.id = token.sub as string;
                session.accessToken = token.accessToken as string;
            }
            return session;
        },
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        }
    },
    pages: {
        signIn: "/auth/signin",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
