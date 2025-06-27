"use client";

import React, { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useUserProfile } from "@/hooks/useMyApiQueries";
import { Github } from "lucide-react";

function LoginButton() {
  const { data: session } = useSession();
  const { data: userData, isLoading, error } = useUserProfile();

  useEffect(() => {
    if (userData?.username) {
      localStorage.setItem("username", userData.username);
    }
  }, [userData]);

  const handleGithubLogin = () => {
    signIn("github", { callbackUrl: "/feed/dashboard" });
  };

  return (
    <div>
      <button
        onClick={handleGithubLogin}
        className="group px-4 py-1.5 bg-[#3ABA81] text-white rounded-lg flex items-center gap-1.5 text-sm font-medium
        transition-all duration-200 ease-out hover:scale-105 hover:cursor-pointer"
      >
        <Github className="w-4 h-4" strokeWidth={2.5} />
        Get Started
      </button>
    </div>
  );
}

export default LoginButton;
