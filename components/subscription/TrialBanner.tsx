'use client'

import { useAuth } from '@/hooks/useAuth'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { differenceInDays, parseISO } from 'date-fns'

export function TrialBanner() {
  const { user } = useAuth()

  if (!user || user.role !== 'professionnel' || user.subscriptionStatus !== 'trialing') {
    return null
  }

  // Calculer jours restants
  const endDate = user.subscriptionEndDate ? parseISO(user.subscriptionEndDate) : null
  
  if (!endDate) return null

  const daysLeft = differenceInDays(endDate, new Date())

  // Afficher seulement si < 7 jours
  if (daysLeft > 7) return null

  // Si expiré
  if (daysLeft < 0) {
     return (
        <div className="bg-destructive text-destructive-foreground p-3 text-center text-sm font-medium">
        Votre période d'essai est expirée. <Link href="/subscribe" className="underline font-bold">Abonnez-vous pour continuer à utiliser la plateforme.</Link>
      </div>
     )
  }

  return (
    <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-3 text-center text-sm font-medium border-b border-yellow-200 dark:border-yellow-900">
      <div className="flex items-center justify-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span>
            Votre période d'essai se termine dans {daysLeft} jour{daysLeft > 1 ? 's' : ''}.
        </span>
        <Link href="/subscribe" className="underline font-bold hover:text-yellow-900 dark:hover:text-yellow-100">
          S'abonner maintenant (49€/mois)
        </Link>
      </div>
    </div>
  )
}
