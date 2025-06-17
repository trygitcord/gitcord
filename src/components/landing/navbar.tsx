"use client";

import Link from "next/link";
import Image from "next/image";
import LoginButton from "./login-btn";

const navigationItems = [
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "Resources",
    href: "#resources",
  },
  {
    title: "Pricing",
    href: "#pricing",
  },
  {
    title: "About",
    href: "#about",
  },
];

function Navbar() {
  return (
    <div className="w-full bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <ul className="flex gap-6">
            {navigationItems.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/"
            className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2"
          >
            <Image src="/logo.svg" alt="Gitcord Logo" width={36} height={36} />
          </Link>

          <LoginButton />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
