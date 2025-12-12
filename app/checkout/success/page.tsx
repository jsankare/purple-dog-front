'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  return (
    <div className="container mx-auto py-16 px-4 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-950/30 p-4">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Paiement réussi !</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            Votre paiement a été effectué avec succès. Les fonds sont bloqués et seront versés au vendeur après confirmation de livraison.
          </p>

          <div className="space-y-2">
            <p className="text-sm font-semibold">Prochaines étapes :</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>1. Le vendeur prépare votre colis</li>
              <li>2. Vous recevrez un email avec le numéro de suivi</li>
              <li>3. Confirmez la réception une fois livré</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/dashboard">Retour au dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/mes-achats">Voir mes achats</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
