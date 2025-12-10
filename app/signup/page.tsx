"use client";

import { useState } from "react";
import Link from "next/link";
import SignupParticulierForm from "@/app/components/auth/SignupParticulierForm";
import SignupProForm from "@/app/components/auth/SignupProForm";
import { User, Briefcase, UserPlus } from "lucide-react";

type Role = "particulier" | "professionnel";

export default function SignupPage() {
  const [role, setRole] = useState<Role>("particulier");

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50/30 to-neutral-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#4B2377] to-purple-700 rounded-2xl mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-2">
            Rejoignez <span className="text-[#4B2377] font-normal">Purple Dog</span>
          </h1>
          <p className="text-neutral-600">Créez votre compte en quelques instants</p>
        </div>

        <div className="flex gap-4 mb-8 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => setRole("particulier")}
            className={`flex-1 p-6 rounded-xl border-2 transition-all duration-300 ${
              role === "particulier"
                ? "border-[#4B2377] bg-purple-50 shadow-lg"
                : "border-neutral-200 bg-white/80 hover:border-neutral-300"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  role === "particulier"
                    ? "bg-gradient-to-br from-[#4B2377] to-purple-700"
                    : "bg-neutral-100"
                }`}
              >
                <User className={`w-6 h-6 ${role === "particulier" ? "text-white" : "text-neutral-600"}`} />
              </div>
              <div>
                <h3
                  className={`font-medium ${
                    role === "particulier" ? "text-[#4B2377]" : "text-neutral-900"
                  }`}
                >
                  Particulier
                </h3>
                <p className="text-sm text-neutral-600 mt-1">Pour acheter et vendre</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole("professionnel")}
            className={`flex-1 p-6 rounded-xl border-2 transition-all duration-300 ${
              role === "professionnel"
                ? "border-[#4B2377] bg-purple-50 shadow-lg"
                : "border-neutral-200 bg-white/80 hover:border-neutral-300"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  role === "professionnel"
                    ? "bg-gradient-to-br from-[#4B2377] to-purple-700"
                    : "bg-neutral-100"
                }`}
              >
                <Briefcase className={`w-6 h-6 ${role === "professionnel" ? "text-white" : "text-neutral-600"}`} />
              </div>
              <div>
                <h3
                  className={`font-medium ${
                    role === "professionnel" ? "text-[#4B2377]" : "text-neutral-900"
                  }`}
                >
                  Professionnel
                </h3>
                <p className="text-sm text-neutral-600 mt-1">Pour votre entreprise</p>
              </div>
            </div>
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-neutral-200/50 p-8">
          {role === "particulier" ? <SignupParticulierForm /> : <SignupProForm />}
        </div>

        <div className="mt-6 text-center">
          <p className="text-neutral-600">
            Vous avez déjà un compte ?{' '}
            <Link 
              href="/login" 
              className="text-[#4B2377] hover:text-purple-700 font-medium transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}