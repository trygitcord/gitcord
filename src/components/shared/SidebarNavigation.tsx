"use client";

import { Home, Building2, BookMarked, Crown, Settings } from "lucide-react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "@/assets/logo.svg";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/feed/dashboard",
    icon: Home,
    live: true,
  },
  {
    title: "Repositories",
    url: "/feed/repositories",
    icon: BookMarked,
    live: true,
  },
  {
    title: "Organizations",
    url: "/feed/organizations",
    icon: Building2,
    live: true,
  },
];

const profileItems = [
  {
    title: "Premium",
    url: "/feed/premium",
    icon: Crown,
  },
  {
    title: "Settings",
    url: "/feed/settings",
    icon: Settings,
  },
];

export function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <Sidebar className="p-4 border-r-2 border-r-neutral-200">
      <SidebarContent>
        <SidebarGroup>
          <Image src={Logo} width={30} height={30} alt="Logo" />
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
                          ? "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-white"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                      }
                      ${!item.live && "cursor-not-allowed"}
                      `}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>

        <SidebarGroupLabel>Profile</SidebarGroupLabel>
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
                          ? "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-white"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                      }
                      `}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
    </Sidebar>
  );
}
