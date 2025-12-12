import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="w-full border-t bg-muted/40 mt-auto">
      <div className="container px-4 py-8 md:px-8 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Colonne 1 : Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold tracking-tight text-indigo-600 dark:text-indigo-400">Purple Dog</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La plateforme de référence pour la vente rapide et les enchères d'objets de valeur.
              Sécurité, rapidité et confiance.
            </p>
          </div>

          {/* Colonne 2 : Liens Rapides */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/catalogue" className="hover:text-foreground transition-colors">Catalogue</Link></li>
              <li><Link href="/dashboard/vendre" className="hover:text-foreground transition-colors">Vendre un objet</Link></li>
              <li><Link href="/comment-ca-marche" className="hover:text-foreground transition-colors">Comment ça marche</Link></li>
              <li><Link href="/avis" className="hover:text-foreground transition-colors">Avis clients</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Légal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Légal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/mentions-legales" className="hover:text-foreground transition-colors">Mentions légales</Link></li>
              <li><Link href="/cgu" className="hover:text-foreground transition-colors">CGU / CGV</Link></li>
              <li><Link href="/confidentialite" className="hover:text-foreground transition-colors">Politique de confidentialité</Link></li>
              <li><Link href="/cookies" className="hover:text-foreground transition-colors">Gestion des cookies</Link></li>
            </ul>
          </div>

          {/* Colonne 4 : Social & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Nous suivre</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                <Facebook className="h-5 w-5" />
                 <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
            <div className="pt-2">
              <Link href="mailto:contact@purpledog.com" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="mr-2 h-4 w-4" />
                contact@purpledog.com
              </Link>
            </div>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Purple Dog. Tous droits réservés.
          </p>
          <div className="flex space-x-4 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Plan du site</Link>
            <Link href="#" className="hover:text-foreground">Accessibilité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
