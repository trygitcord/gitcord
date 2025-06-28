"use client";

import React, { useEffect } from "react";
import { LogOut, Globe, Moon, Crown, CreditCard, Shield } from "lucide-react";
import { useUserProfile } from "@/hooks/useMyApiQueries";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShareProfileButton } from "@/components/shared/ShareProfileButton";

function SettingsPage() {
  useEffect(() => {
    document.title = "Feed | Settings";
  }, []);

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useUserProfile();

  const { setTheme, theme } = useTheme();
  const router = useRouter();

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push("/");
  }

  if (userLoading || !userData || userError) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-lg">Settings</h1>
        <p className="text-neutral-500 text-sm dark:text-neutral-400">
          Manage your account and preferences.
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 space-y-4 relative">
        {userData.isModerator && (
          <div className="absolute top-4 right-4 flex items-center space-x-2 text-[#5BC898]">
            <Shield className="w-4 h-4" />
            <span className="text-xs">Moderator</span>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
            <Image className="rounded-full"
              src={userData.avatar_url}
              alt="User Avatar"
              width={64}
              height={64}
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Name
            </p>
            <div className="flex items-center gap-2">
              <p className="text-sm">{userData.name}</p>
              <ShareProfileButton username={userData.username} />
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {userData.email}
            </p>
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="w-5 h-5 text-neutral-500" />
            <span className="text-sm">Premium Status</span>
          </div>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {userData.premium.isPremium ? "Premium" : "Free"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-5 h-5 text-neutral-500" />
            <span className="text-sm">Credits</span>
          </div>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {userData.stats.credit} credits
          </span>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Moon className="w-5 h-5 text-neutral-500" />
            <span className="text-sm">Theme</span>
          </div>
          <select
            className="w-32 p-1.5 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-neutral-500" />
            <span className="text-sm">Language</span>
          </div>
          <select className="w-32 p-1.5 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md">
            <option>English</option>
          </select>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 space-y-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 text-sm hover:text-red-400 hover:cursor-pointer transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
