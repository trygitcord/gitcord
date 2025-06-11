"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { signOut } from "next-auth/react";
import React from "react";

function page() {
  async function handleSignOut() {
    await signOut();
  }

  return (
    <div>
      <Button onClick={handleSignOut}>Sign Out</Button>
      <ThemeToggle />
    </div>
  );
}

export default page;
