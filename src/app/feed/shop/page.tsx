"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function ShopPage() {
  const router = useRouter();

  // Redirect to dashboard since shop is not live yet
  useEffect(() => {
    router.replace("/feed/dashboard");
  }, [router]);

  // Return null to prevent rendering while redirecting
  return null;
}

export default ShopPage;
