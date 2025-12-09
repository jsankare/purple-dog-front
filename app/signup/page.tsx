"use client";

import { useState } from "react";
import SignupParticulierForm from "@/app/components/auth/SignupParticulierForm";
import SignupProForm from "@/app/components/auth/SignupProForm";

type Role = "particulier" | "professionnel";

export default function SignupPage() {
  const [role, setRole] = useState<Role>("particulier");

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto w-full max-w-3xl px-4 py-12">
        <header className="mb-6">
          <h1 className="h1">Créer un compte</h1>
          <p className="mt-2 text-muted">Inscrivez-vous en tant que particulier ou professionnel.</p>
        </header>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRole("particulier")}
            className="btn btn-outline"
            aria-pressed={role === "particulier"}
            style={{
              background: role === "particulier" ? "var(--surface-2)" : "var(--surface)",
              borderColor: role === "particulier" ? "var(--brand)" : "var(--border)",
              color: "var(--text)",
            }}
          >
            Particulier
          </button>
          <button
            type="button"
            onClick={() => setRole("professionnel")}
            className="btn btn-outline"
            aria-pressed={role === "professionnel"}
            style={{
              background: role === "professionnel" ? "var(--surface-2)" : "var(--surface)",
              borderColor: role === "professionnel" ? "var(--brand)" : "var(--border)",
              color: "var(--text)",
            }}
          >
            Professionnel
          </button>
        </div>

        <div className="mt-8 card">
          {role === "particulier" ? <SignupParticulierForm /> : <SignupProForm />}
        </div>
      </div>
    </main>
  );
}