"use client";

import React, { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { getUserProfile } from "@/stores/user/userProfileSlice";

function Test() {
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
    <div className="flex items-center justify-center min-h-screen gap-4">
      <button
        onClick={handleGithubLogin}
        className="px-4 py-2 text-white bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
      >
        GitHub ile Giriş Yap
      </button>
    </div>
  );
}

export default Test;
