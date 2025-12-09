import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; 
import "./globals.css";
import type { Metadata } from "next";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import Bot from "@/app/components/bot/bot";

export const metadata: Metadata = {
  title: "Purple Dog",
  description: "LA plateforme pour vendre mieux vos objets de valeur",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-white text-gray-900 relative">
        <Header />
        <Bot />
        {children}
        <Footer />
      </body>
    </html>
  );
}