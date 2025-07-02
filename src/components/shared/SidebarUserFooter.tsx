"use client";

import { signOut, useSession } from "next-auth/react";
import React from "react";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function SidebarUserFooter() {
  const router = useRouter();

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push("/");
  }

  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-between dark:hover:bg-neutral-800 hover:bg-neutral-100 hover:cursor-pointer rounded-lg p-2">
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
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          className="flex items-center gap-2 focus:text-red-600 dark:text-neutral-200 focus:cursor-pointer text-neutral-900 font-normal dark:focus:text-red-400"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SidebarUserFooter;
