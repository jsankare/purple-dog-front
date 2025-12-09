"use client";

import { useState } from "react";
import SignupParticulierForm from "@/app/components/auth/SignupParticulierForm";
import SignupProForm from "@/app/components/auth/SignupProForm";

type Role = "particulier" | "professionnel";

export default function SignupPage() {
  const [role, setRole] = useState<Role>("particulier");

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto w-full max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-semibold">Créer un compte</h1>
        <p className="mt-2 text-sm text-gray-600">
          Inscrivez-vous en tant que particulier ou professionnel.
        </p>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setRole("particulier")}
            className={`rounded-md px-4 py-2 text-sm font-medium \${
              role === "particulier" ? "bg-black text-white" : "border"
            }`}
          >
            Particulier
          </button>
          <button
            type="button"
            onClick={() => setRole("professionnel")}
            className={`rounded-md px-4 py-2 text-sm font-medium \${
              role === "professionnel" ? "bg-black text-white" : "border"
            }`}
          >
            Professionnel
          </button>
        </div>

        <div className="mt-8">
          {role === "particulier" ? <SignupParticulierForm /> : <SignupProForm />}
        </div>
      </div>
    </main>
  );
}