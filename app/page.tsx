'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Star, ShieldCheck, Truck } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-primary/5 to-background">
        <Badge variant="secondary" className="mb-4">
          Nouveau : Enchères en direct
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 max-w-3xl">
          Vendez et achetez vos objets de valeur en toute <span className="text-primary">confiance</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Purple Dog est la plateforme de référence pour les particuliers et professionnels. 
          Enchères sécurisées, paiements garantis et experts certifiés.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/catalogue">
              Voir le catalogue <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/dashboard/vendre">
              Commencer à vendre
            </Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-background border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 inline-flex p-3 rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sécurité Garantie</h3>
              <p className="text-muted-foreground">
                Toutes les transactions sont sécurisées et les fonds sont protégés jusqu'à la réception.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 inline-flex p-3 rounded-full bg-primary/10 text-primary">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Experts Certifiés</h3>
              <p className="text-muted-foreground">
                Nos experts évaluent chaque objet de valeur pour garantir son authenticité.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 inline-flex p-3 rounded-full bg-primary/10 text-primary">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Livraison Suivie</h3>
              <p className="text-muted-foreground">
                Suivez votre colis en temps réel avec nos partenaires logistiques premium.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
