"use client";

import {
  Trello,
  Building2,
  BookMarked,
  Settings,
  ChartColumnBig,
  Inbox,
  User,
} from "lucide-react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "@/assets/logo.svg";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Image from "next/image";
import SidebarUserFooter from "@/components/shared/SidebarUserFooter";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/feed/dashboard",
    icon: Trello,
    live: true,
  },
  {
    title: "Inbox",
    url: "/feed/inbox",
    icon: Inbox,
    live: true,
  },
];

const profileItems = [
  {
    title: "Profile",
    url: "/feed/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/feed/settings",
    icon: Settings,
  },
];

const activityItems = [
  {
    title: "Activity",
    url: "/feed/activity",
    icon: ChartColumnBig,
  },
  {
    title: "Repositories",
    url: "/feed/repositories",
    icon: BookMarked,
  },
  {
    title: "Organization",
    url: "/feed/organization",
    icon: Building2,
  },
];

export function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <Sidebar className="p-4 border-r-2 border-r-neutral-200 dark:bg-neutral-950 dark:border-r-neutral-800">
      <SidebarContent className="dark:bg-neutral-950">
        <SidebarGroup>
          <Link href="/feed/dashboard" className="flex items-center gap-3">
            <Image src={Logo} width={28} height={28} alt="Logo" />
            <h1 className="font-medium">Gitcord</h1>
          </Link>
        </SidebarGroup>

        <SidebarGroupLabel>Overview</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`flex items-center gap-2 w-full p-2 rounded-md transition-all ${
                        isActive
                          ? "bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-white border border-neutral-100 dark:border-neutral-800"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                      }
                      ${!item.live && "cursor-not-allowed"}
                      `}
                    >
                      <item.icon
                        className={`${isActive ? "text-[#5BC898]" : ""}`}
                      />
                      <span className={`${isActive ? "text-[#5BC898]" : ""}`}>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>

        <SidebarGroupLabel>Development</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {activityItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`flex items-center gap-2 w-full p-2 rounded-md transition-all ${
                        isActive
                          ? "bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-white border border-neutral-100 dark:border-neutral-800"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                      }
                      `}
                    >
                      <item.icon
                        className={`${isActive ? "text-[#5BC898]" : ""}`}
                      />
                      <span className={`${isActive ? "text-[#5BC898]" : ""}`}>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>

        <SidebarGroupLabel>Account</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {profileItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`flex items-center gap-2 w-full p-2 rounded-md transition-all ${
                        isActive
                          ? "bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-white border border-neutral-100 dark:border-neutral-800"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                      }
                      `}
                    >
                      <item.icon
                        className={`${isActive ? "text-[#5BC898]" : ""}`}
                      />
                      <span className={`${isActive ? "text-[#5BC898]" : ""}`}>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
