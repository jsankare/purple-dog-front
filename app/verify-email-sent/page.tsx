'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MailCheck } from 'lucide-react'

export default function VerifyEmailSentPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4 flex flex-col items-center">
          <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <MailCheck className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Vérifiez vos emails</CardTitle>
          <CardDescription className="text-base">
            Un lien de confirmation a été envoyé à votre adresse email.
            Veuillez cliquer dessus pour activer votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
            <p>Pensez à vérifier vos spams si vous ne recevez rien d&apos;ici quelques minutes.</p>
          </div>
          <Link href="/login" className="w-full block">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
              Retour à la connexion
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
