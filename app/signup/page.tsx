"use client";

import { useState } from "react";
import Link from "next/link";
import SignupParticulierForm from "@/app/components/auth/SignupParticulierForm";
import SignupProForm from "@/app/components/auth/SignupProForm";
import { User, Briefcase, ArrowLeft } from "lucide-react";

type Role = "particulier" | "professionnel";

export default function SignupPage() {
  const [role, setRole] = useState<Role>("particulier");

  return (
    <div className="min-h-screen bg-[#F9F3FF] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-[#4B2377] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-neutral-900 mb-2">
            Créer un compte
          </h1>
          <div className="w-24 h-px bg-[#4B2377] mb-4"></div>
          <p className="text-neutral-600">
            Rejoignez Purple Dog et accédez à notre plateforme d'objets de luxe
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Type de compte
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole("particulier")}
              className={`p-6 border-2 transition-all ${
                role === "particulier"
                  ? "border-[#4B2377] bg-purple-50"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 flex-shrink-0 flex items-center justify-center transition-colors ${
                    role === "particulier"
                      ? "bg-[#4B2377] text-white"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  <User className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3
                    className={`font-semibold text-lg mb-1 ${
                      role === "particulier" ? "text-[#4B2377]" : "text-neutral-900"
                    }`}
                  >
                    Particulier
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Pour vendre vos objets de valeur
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole("professionnel")}
              className={`p-6 border-2 transition-all ${
                role === "professionnel"
                  ? "border-[#4B2377] bg-purple-50"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 flex-shrink-0 flex items-center justify-center transition-colors ${
                    role === "professionnel"
                      ? "bg-[#4B2377] text-white"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3
                    className={`font-semibold text-lg mb-1 ${
                      role === "professionnel" ? "text-[#4B2377]" : "text-neutral-900"
                    }`}
                  >
                    Professionnel
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Pour acheter et vendre en tant que professionnel
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-neutral-200 p-8">
          {role === "particulier" ? <SignupParticulierForm /> : <SignupProForm />}
        </div>

        {/* Login Link */}
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
