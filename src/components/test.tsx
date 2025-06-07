"use client";

import React from "react";
import { signIn, signOut } from "next-auth/react";

function Test() {
  const handleGithubLogin = () => {
    signIn("github", { callbackUrl: "/dashboard" });
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
