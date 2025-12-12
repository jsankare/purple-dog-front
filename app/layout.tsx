import type { Metadata } from "next";
import { Inter } from "next/font/google"; 
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { LayoutContent } from "@/components/LayoutContent";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Purple Dog",
  description: "LA plateforme pour vendre mieux vos objets de valeur",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased flex flex-col`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <AuthProvider>
            <LayoutContent>{children}</LayoutContent>
            <Toaster richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
