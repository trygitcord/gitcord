import axios from "axios";
import { getSession } from "next-auth/react";

// Define our custom session interface with accessToken
interface ExtendedSession {
  accessToken?: string;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isModerator?: boolean;
  };
}

const githubAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GITHUB_API_URL || "https://api.github.com",
});

githubAxios.interceptors.request.use(async (config) => {
  const session = (await getSession()) as ExtendedSession | null;
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export default githubAxios;
