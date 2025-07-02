declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isModerator?: boolean;
    };
  }

  interface JWT {
    accessToken?: string;
    isModerator?: boolean;
  }
}
