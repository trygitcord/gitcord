"use client";

import React, { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { getUserProfile } from "@/stores/user/userProfileSlice";
import { Github } from "lucide-react";

function LoginButton() {
  const { data: session } = useSession();
  const { data: userData, fetchData: fetchUserProfile } = getUserProfile();

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile();
    }
  }, [session]);

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
        className="group px-4 py-1.5 bg-[#3ABA81] text-white rounded-lg flex items-center gap-1.5 text-sm font-semibold
        border border-[#4aa882]/20
        shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]
        hover:bg-[#4aa882] hover:border-[#4aa882]/30
        active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.1)]
        transition-all duration-200 ease-out hover:scale-105 hover:cursor-pointer"
      >
        <Github className="w-4 h-4" strokeWidth={2.5} />
        Get Started
      </button>
    </div>
  );
}

export default LoginButton;
