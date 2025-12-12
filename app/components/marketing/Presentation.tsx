import { Shield, Users, TrendingUp, Award } from "lucide-react";
import Link from "next/link";

export default function Presentation() {
  return (
    <section className="bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800 p-8 lg:p-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-serif text-neutral-900 dark:text-white mb-6">
            Purple Dog
          </h2>
          <div className="w-24 h-px bg-[#4B2377] dark:bg-[#6d28d9] mx-auto mb-8"></div>
          <p className="text-2xl lg:text-3xl text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <span className="font-semibold text-[#4B2377] dark:text-[#a78bfa] transition-colors">LA plateforme</span> pour vendre mieux vos objets de valeur à des{" "}
            <span className="font-semibold text-[#4B2377] dark:text-[#a78bfa] transition-colors">tiers de confiance</span>
          </p>
        </div>

        <div className="mb-12 text-center">
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl mx-auto">
            Purple Dog révolutionne la vente d'objets de collection en connectant vendeurs et acheteurs
            de confiance. Notre plateforme garantit transparence, sécurité et valorisation optimale de
            vos biens précieux.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 border-2 border-[#4B2377] dark:border-[#6d28d9] flex items-center justify-center rounded-none dark:rounded-lg transition-colors">
                <Shield className="w-6 h-6 text-[#4B2377] dark:text-[#a78bfa] transition-colors" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Sécurité garantie</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Transactions sécurisées et authentification systématique des objets par nos experts
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 border-2 border-[#4B2377] dark:border-[#6d28d9] flex items-center justify-center rounded-none dark:rounded-lg transition-colors">
                <Users className="w-6 h-6 text-[#4B2377] dark:text-[#a78bfa] transition-colors" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Communauté de confiance</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Réseau vérifié d'acheteurs et vendeurs passionnés et professionnels
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 border-2 border-[#4B2377] dark:border-[#6d28d9] flex items-center justify-center rounded-none dark:rounded-lg transition-colors">
                <TrendingUp className="w-6 h-6 text-[#4B2377] dark:text-[#a78bfa] transition-colors" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Valorisation optimale</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Système d'enchères transparent pour obtenir le meilleur prix pour vos objets
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 border-2 border-[#4B2377] dark:border-[#6d28d9] flex items-center justify-center rounded-none dark:rounded-lg transition-colors">
                <Award className="w-6 h-6 text-[#4B2377] dark:text-[#a78bfa] transition-colors" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Expertise reconnue</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Plus de 10 ans d'expérience dans le marché des objets d'art et de collection
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/comment-ca-marche"
            className="inline-block px-8 py-4 bg-[#4B2377] text-white hover:bg-[#3d1d61] dark:bg-[#6d28d9] dark:hover:bg-[#5b21b6] transition-colors font-medium rounded-none dark:rounded"
          >
            Découvrir comment ça marche
          </Link>
        </div>
      </div>
    </section>
  );
}
