"use client";

import { useStoreCleanup } from "@/hooks/use-store-cleanup";

export function StoreCleanupProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useStoreCleanup();
  return <>{children}</>;
}
