'use client'

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {!isDashboard && <Footer />}
    </>
  );
}
