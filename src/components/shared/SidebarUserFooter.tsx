"use client";

import { signOut, useSession } from "next-auth/react";
import React from "react";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

function SidebarUserFooter() {
  const router = useRouter();

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push("/");
  }

  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 rounded-full overflow-hidden">
          <Image
            src={session.user.image || "/default-avatar.png"}
            alt={session.user.name || "User"}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-neutral-900 dark:text-white">
            {session.user.name}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {session.user.email}
          </span>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
      >
        <LogOut size={18} className="hover:cursor-pointer" />
      </button>
    </div>
  );
}

export default SidebarUserFooter;
