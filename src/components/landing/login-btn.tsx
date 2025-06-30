"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { useUserProfile } from "@/hooks/useMyApiQueries";
import { Github } from "lucide-react";

function LoginButton() {
  const handleGithubLogin = () => {
    signIn("github", { callbackUrl: "/feed/dashboard" });
  };

  return (
    <button
      onClick={handleGithubLogin}
      className="group relative flex items-center gap-3 px-5 py-2 bg-neutral-900/80 text-white border border-neutral-800/50 rounded-xl font-medium text-sm
      hover:bg-neutral-800/80 hover:border-neutral-600/50 hover:shadow-xl hover:shadow-neutral-900/25 hover:-translate-y-0.5
      transition-all duration-300 ease-out backdrop-blur-sm
      focus:outline-none focus:ring-2 focus:ring-neutral-500/50 hover:cursor-pointer focus:ring-offset-2 focus:ring-offset-transparent"
    >
      <Github className="w-4 h-4" strokeWidth={2} />
      <span>Get Started</span>
    </button>
  );
}

export default LoginButton;
