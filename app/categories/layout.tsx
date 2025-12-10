import { ReactNode } from "react";

export default function CategoriesLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        {children}
      </div>
    </main>
  );
}
