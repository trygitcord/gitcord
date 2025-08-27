"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BreadcrumbNav() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  const createBreadcrumbs = () => {
    const crumbs = pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      const isLast = index === pathSegments.length - 1;

      return (
        <div key={href} className="flex items-center">
          <ChevronRight className="w-4 h-4 text-neutral-500 mx-1.5" />
          {isLast ? (
            <span className="text-neutral-100 font-medium capitalize text-sm bg-neutral-800/50 px-2 py-1 rounded-md">
              {decodeURIComponent(segment)}
            </span>
          ) : (
            <Link
              href={href}
              className="text-neutral-400 hover:text-[#49F9AA] transition-all duration-200 capitalize text-sm hover:scale-105 transform px-2 py-1 rounded-md hover:bg-neutral-800/30"
            >
              {decodeURIComponent(segment)}
            </Link>
          )}
        </div>
      );
    });

    return crumbs;
  };

  return (
    <nav className="mb-5" aria-label="Breadcrumb">
      <div className="flex items-center">
        <Link
          href="/feed"
          className="flex items-center gap-2 text-[#49F9AA] hover:text-[#49F9AA]/80 transition-all duration-200 font-medium text-sm group"
        >
          <div className="p-1.5 rounded-md group-hover:bg-[#49F9AA]/10 transition-colors duration-200">
            <Home className="w-3.5 h-3.5" />
          </div>
          <span>Gitcord</span>
        </Link>
        {createBreadcrumbs()}
      </div>
    </nav>
  );
}
