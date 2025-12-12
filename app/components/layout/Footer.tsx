import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import logo from "@/public/purple-dog-nobg.webp";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111111] border-t border-neutral-800">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link href={"/"}>
                <Image width={100} src={logo} alt={"Logo purple dog"} />
              </Link>
              <span className="text-xl font-serif text-white">
                Purple Dog
              </span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">
              LA plateforme pour vendre mieux vos objets de valeur à des tiers de confiance.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/purpledog"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-neutral-700 hover:border-[#4B2377] flex items-center justify-center transition-colors group"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-neutral-400 group-hover:text-[#4B2377] transition-colors" />
              </a>

              <a
                href="https://facebook.com/purpledog"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-neutral-700 hover:border-[#4B2377] flex items-center justify-center transition-colors group"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-neutral-400 group-hover:text-[#4B2377] transition-colors" />
              </a>

              <a
                href="https://linkedin.com/company/purpledog"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-neutral-700 hover:border-[#4B2377] flex items-center justify-center transition-colors group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-neutral-400 group-hover:text-[#4B2377] transition-colors" />
              </a>

              <a
                href="https://tiktok.com/@purpledog"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-neutral-700 hover:border-[#4B2377] flex items-center justify-center transition-colors group"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 text-neutral-400 group-hover:text-[#4B2377] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>

              <a
                href="https://pinterest.com/purpledog"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-neutral-700 hover:border-[#4B2377] flex items-center justify-center transition-colors group"
                aria-label="Pinterest"
              >
                <svg className="w-4 h-4 text-neutral-400 group-hover:text-[#4B2377] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0a12 12 0 00-4.37 23.17c-.05-.92-.1-2.34.02-3.35l.73-3.1s-.19-.38-.19-.93c0-.88.5-1.53 1.13-1.53.53 0 .79.4.79.88 0 .53-.34 1.33-.52 2.07-.15.63.31 1.15.94 1.15 1.13 0 2-1.19 2-2.91 0-1.52-1.09-2.58-2.65-2.58-1.8 0-2.86 1.35-2.86 2.75 0 .54.21 1.13.47 1.45.05.06.06.12.04.18l-.18.73c-.03.1-.1.13-.2.08-1-.46-1.62-1.92-1.62-3.09 0-2 1.45-3.83 4.18-3.83 2.2 0 3.91 1.57 3.91 3.66 0 2.18-1.38 3.94-3.29 3.94-.64 0-1.25-.34-1.45-.73l-.4 1.5c-.14.54-.52 1.22-.78 1.63a12 12 0 1010.27-10.71z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              À propos
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/qui-sommes-nous"
                  className="text-sm text-neutral-400 hover:text-[#4B2377] transition-colors"
                >
                  Qui sommes-nous ?
                </Link>
              </li>
              <li>
                <Link
                  href="/comment-ca-marche"
                  className="text-sm text-neutral-400 hover:text-[#4B2377] transition-colors"
                >
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link
                  href="/nos-experts"
                  className="text-sm text-neutral-400 hover:text-[#4B2377] transition-colors"
                >
                  Nos experts
                </Link>
              </li>
              <li>
                <Link
                  href="/temoignages"
                  className="text-sm text-neutral-400 hover:text-[#4B2377] transition-colors"
                >
                  Témoignages
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Liens utiles
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/encheres"
                  className="text-sm text-neutral-400 hover:text-[#4B2377] transition-colors"
                >
                  Enchères en cours
                </Link>
              </li>
              <li>
                <Link
                  href="/vendre"
                  className="text-sm text-neutral-400 hover:text-[#4B2377] transition-colors"
                >
                  Vendre un objet
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-neutral-400 hover:text-[#4B2377] transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-neutral-400 hover:text-[#4B2377] transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#4B2377] mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:contact@purpledog.fr"
                  className="text-sm text-neutral-400 hover:text-[#4B2377] transition-colors"
                >
                  contact@purpledog.fr
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#4B2377] mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+33123456789"
                  className="text-sm text-neutral-400 hover:text-[#4B2377] transition-colors"
                >
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#4B2377] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-400">
                  123 Avenue des Champs-Élysées<br />
                  75008 Paris, France
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-500">
              © {currentYear} Purple Dog. Tous droits réservés.
            </p>
            <nav className="flex items-center gap-6">
              <Link
                href="/mentions-legales"
                className="text-sm text-neutral-500 hover:text-[#4B2377] transition-colors"
              >
                Mentions légales
              </Link>
              <Link
                href="/politique-confidentialite"
                className="text-sm text-neutral-500 hover:text-[#4B2377] transition-colors"
              >
                Confidentialité
              </Link>
              <Link
                href="/cgv"
                className="text-sm text-neutral-500 hover:text-[#4B2377] transition-colors"
              >
                CGV
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
