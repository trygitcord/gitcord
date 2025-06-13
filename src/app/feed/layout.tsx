// app/dashboard/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarNavigation } from "@/components/shared/SidebarNavigation";
import { Poppins } from "next/font/google";
import Breadcrumb from "@/components/shared/Path";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard layout",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SidebarProvider>
          <SidebarNavigation />

          <main className="w-full h-screen dark:bg-neutral-950 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <SidebarTrigger />
            <div className="p-8 w-full h-[calc(100vh-4rem)]">
              <Breadcrumb />
              {children}
            </div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
