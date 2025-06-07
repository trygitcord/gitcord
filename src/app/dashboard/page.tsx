"use client";

import { signOut } from "next-auth/react";
import React from "react";

function page() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };
  return (
    <div>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
      >
        Çıkış Yap
      </button>
    </div>
  );
}

export default page;
