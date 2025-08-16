"use client";

import React, { useEffect } from "react";
import {
  LogOut,
  Globe,
  Moon,
  Crown,
  CreditCard,
  Shield,
  Gift,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { useUserProfile, useUpdatePrivacy } from "@/hooks/useMyApiQueries";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShareProfileButton } from "@/components/shared/ShareProfileButton";
import ReedemCode from "@/components/shared/ReedemCode";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
  const [language, setLanguage] = React.useState("English");
  const [isPrivate, setIsPrivate] = React.useState(false);
  const updatePrivacyMutation = useUpdatePrivacy();

  React.useEffect(() => {
    if (userData?.isPrivate !== undefined) {
      setIsPrivate(userData.isPrivate);
    }
  }, [userData]);

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push("/");
  }

  function handlePrivacyToggle() {
    if (updatePrivacyMutation.isPending) return;
    
    const newPrivateValue = !isPrivate;
    updatePrivacyMutation.mutate(newPrivateValue);
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
            <Image
              className="rounded-full"
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
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-between w-32 px-3 py-1.5 text-sm bg-white dark:bg-neutral-800 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-750">
              <span className="capitalize">{theme || "system"}</span>
              <ChevronDown className="w-4 h-4 text-neutral-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-neutral-500" />
            <span className="text-sm">Language</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-between w-32 px-3 py-1.5 text-sm bg-white dark:bg-neutral-800 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-750">
              <span>{language}</span>
              <ChevronDown className="w-4 h-4 text-neutral-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => setLanguage("English")}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isPrivate ? (
              <EyeOff className="w-5 h-5 text-neutral-500" />
            ) : (
              <Eye className="w-5 h-5 text-neutral-500" />
            )}
            <div>
              <span className="text-sm">Leaderboard Visibility</span>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {isPrivate ? "Hidden from leaderboard" : "Visible on leaderboard"}
              </p>
            </div>
          </div>
          <button
            onClick={handlePrivacyToggle}
            disabled={updatePrivacyMutation.isPending}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#5BC898] focus:ring-offset-2 ${
              isPrivate ? "bg-[#5BC898]" : "bg-gray-200 dark:bg-gray-700"
            } ${updatePrivacyMutation.isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isPrivate ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Gift className="w-5 h-5 text-neutral-500" />
            <span className="text-sm">Reedem Code</span>
          </div>
          <ReedemCode />
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
