'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto py-16 px-4 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 dark:bg-red-950/30 p-4">
              <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Paiement annulé</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            Votre paiement a été annulé. Aucun montant n'a été débité.
          </p>

          <p className="text-sm text-muted-foreground">
            Vous pouvez réessayer à tout moment. La transaction reste disponible pendant 24h.
          </p>

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
