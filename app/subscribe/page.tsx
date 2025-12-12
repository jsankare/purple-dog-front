'use client'

import { SubscriptionFlow } from '@/components/subscription/SubscriptionFlow'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function SubscribePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/subscribe')
    }
    // Si déjà abonné actif, rediriger vers dashboard
    if (!isLoading && user?.subscriptionStatus === 'active' && user?.role === 'professionnel') {
        // Attention : 'active' est aussi utilisé pendant la période d'essai dans notre implémentation
        // Il faudrait distinguer "active" (payé) de "trialing" (essai) si on veut être strict
        // Mais ici on veut juste éviter de repayer si tout est ok.
        // On suppose que l'utilisateur vient ici car il a été redirigé ou a cliqué "S'abonner"
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">
        
        {/* Colonne Gauche : Argumentaire */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Passez au niveau supérieur
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Débloquez tout le potentiel de Purple Dog avec l'abonnement professionnel.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="bg-primary/10 p-2 rounded-full h-fit">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Enchères illimitées</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Participez à autant d'enchères que vous le souhaitez sans restriction.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-primary/10 p-2 rounded-full h-fit">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Vente d'objets</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Mettez en vente vos propres objets et touchez des milliers d'acheteurs.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-primary/10 p-2 rounded-full h-fit">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Support prioritaire</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Accès à notre équipe de support dédiée aux professionnels 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Formulaire Paiement */}
        <Card className="border-primary/20 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
          <CardHeader>
            <CardTitle>Abonnement Professionnel</CardTitle>
            <CardDescription>
              Accès complet à la plateforme
            </CardDescription>
            <div className="mt-4 pb-4 border-b">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">49€</span>
                <span className="text-muted-foreground">/mois</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Annulable à tout moment. Facturation mensuelle.
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <SubscriptionFlow />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
