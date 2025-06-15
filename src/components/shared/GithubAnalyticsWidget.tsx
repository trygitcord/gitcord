"use client";

import { Github } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const GithubAnalyticsWidget = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[300px] bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-base flex items-center gap-2 text-gray-900">
          <Image
            src="/logo.svg"
            alt="Gitcord Logo"
            width={20}
            height={20}
            className="w-5 h-5"
          />
          Gitcord
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="bg-transparent border-none text-lg cursor-pointer text-gray-600 hover:text-gray-900"
        >
          ×
        </button>
      </div>
      <div className="my-3 text-gray-600 text-sm">
        Connect your GitHub account to unlock detailed analytics and insights
        about your coding activity.
      </div>
      <Link href="/">
        <button className="w-full bg-gray-950 text-white text-sm rounded-lg py-1.5 hover:cursor-pointer font-medium my-2 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
          <Github size={16} /> Sign in with GitHub
        </button>
      </Link>
      <div className="text-xs text-gray-600 text-center">
        Your data is secure and private
      </div>
    </div>
  );
};

export default GithubAnalyticsWidget;
