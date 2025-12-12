'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { CheckoutForm } from './CheckoutForm'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

// Initialiser Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function SubscriptionFlow() {
  const [clientSecret, setClientSecret] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Créer la souscription dès le chargement pour obtenir le clientSecret
    const createSubscription = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-subscription`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Envoyer l'ID du prix (récupéré des variables d'env ou config)
          body: JSON.stringify({ 
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID 
          }),
          credentials: 'include',
        })

        if (!response.ok) {
           const error = await response.json()
           throw new Error(error.error || 'Erreur lors de l\'initialisation')
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error: any) {
        console.error('Error creating subscription:', error)
        toast.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    createSubscription()
  }, [])

  if (isLoading && !clientSecret) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Impossible de charger le formulaire de paiement.
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={{ 
      clientSecret, 
      appearance: { theme: 'stripe' },
      locale: 'fr'
    }}>
      <CheckoutForm />
    </Elements>
  )
}
