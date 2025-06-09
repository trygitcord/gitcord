"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  const createBreadcrumbs = () => {
    const crumbs = pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");

      return (
        <span key={href} className="flex items-center space-x-1">
          <span className="text-neutral-300">/</span>
          <Link
            href={href}
            className="text-[#5BC898] hover:underline capitalize"
          >
            {decodeURIComponent(segment)}
          </Link>
        </span>
      );
    });

    return crumbs;
  };

  return (
    <nav className="mb-4 text-sm text-neutral-300">
      <div className="flex items-center space-x-1">
        <Link href="/" className="text-[#5BC898] hover:underline">
          Gitcord
        </Link>
        {createBreadcrumbs()}
      </div>
    </nav>
  );
}
