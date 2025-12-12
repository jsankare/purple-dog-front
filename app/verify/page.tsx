'use client'

import { useEffect, useState, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authAPI } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const verifiedRef = useRef(false)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage("Aucun token de vérification n'a été fourni.")
      return
    }

    if (verifiedRef.current) {
      return
    }
    verifiedRef.current = true // Marquer comme exécuté AVANT l'appel async

    const verify = async () => {
      try {
        const response = await authAPI.verifyEmail(token)
        setStatus('success')
        setMessage(response.message || 'Votre compte a été vérifié avec succès !')
        
        // Redirection automatique après succès
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } catch (err: any) {
        // Si l'erreur mentionne "already verified" ou similaire, on considère le succès
        if (err.message && (err.message.includes('already') || err.message.includes('déjà') || err.message.includes('verified'))) {
            setStatus('success')
            setMessage('Votre compte est déjà vérifié !')
            setTimeout(() => {
              router.push('/login')
            }, 2000)
        } else {
            setStatus('error')
            setMessage(err.message || 'Le lien de vérification est invalide ou a expiré.')
        }
      }
    }

    verify()
  }, [token])

  if (status === 'loading') {
    return (
      <CardHeader className="space-y-4 flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <CardTitle>Vérification en cours...</CardTitle>
        <CardDescription>
          Veuillez patienter pendant que nous validons votre compte.
        </CardDescription>
      </CardHeader>
    )
  }

  if (status === 'success') {
    return (
      <>
        <CardHeader className="space-y-4 flex flex-col items-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <CardTitle className="text-2xl text-green-600">Compte vérifié !</CardTitle>
          <CardDescription className="text-base text-center">
            Votre adresse email a été confirmée avec succès.
            Vous pouvez maintenant vous connecter et accéder au dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login" className="w-full block">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
              Se connecter
            </Button>
          </Link>
        </CardContent>
      </>
    )
  }

  return (
    <>
      <CardHeader className="space-y-4 flex flex-col items-center">
        <XCircle className="h-16 w-16 text-amber-500" />
        <CardTitle className="text-2xl text-amber-600">Lien expiré ou invalide</CardTitle>
        <CardDescription className="text-base text-center text-muted-foreground">
          {message}
          <br className="my-2" />
          Il est possible que votre compte soit déjà activé.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link href="/login" className="w-full block">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
             Se connecter
          </Button>
        </Link>
        <Link href="/resend-verification" className="w-full block">
          <Button variant="outline" className="w-full">
            Renvoyer le lien de validation
          </Button>
        </Link>
        <Link href="/" className="w-full block">
          <Button variant="outline" className="w-full">
            Retour à l&apos;accueil
          </Button>
        </Link>
      </CardContent>
    </>
  )
}

export default function VerifyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <Card className="w-full max-w-md">
        <Suspense fallback={
          <CardHeader className="space-y-4 flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <CardTitle>Chargement...</CardTitle>
          </CardHeader>
        }>
          <VerifyContent />
        </Suspense>
      </Card>
    </div>
  )
}
