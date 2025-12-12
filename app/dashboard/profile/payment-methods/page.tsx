'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, CreditCard, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { toast } from 'sonner'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PaymentMethodsPage() {
  const { user } = useAuth()
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/payment-methods`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setPaymentMethods(data.paymentMethods || [])
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPaymentMethod = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/setup-intent`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!res.ok) {
        const error = await res.json()
        toast.error(error.error || 'Erreur lors de la création du Setup Intent')
        return
      }

      const data = await res.json()
      setClientSecret(data.clientSecret)
      setShowAddForm(true)
    } catch (error) {
      console.error('Error creating setup intent:', error)
      toast.error('Erreur lors de la création du Setup Intent')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce moyen de paiement ?')) {
      return
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/payment-methods?id=${paymentMethodId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      if (res.ok) {
        toast.success('Moyen de paiement supprimé')
        fetchPaymentMethods()
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting payment method:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  if (user?.role !== 'professionnel') {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Les moyens de paiement sont réservés aux professionnels
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Moyens de paiement</h1>
        <p className="text-muted-foreground">
          Gérez vos cartes bancaires pour participer aux enchères
        </p>
        {!user?.hasValidPaymentMethod && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              ⚠️ Vous devez ajouter un moyen de paiement pour pouvoir enchérir
            </p>
          </div>
        )}
      </div>

      {loading && !showAddForm ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Existing payment methods */}
          {paymentMethods.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Cartes enregistrées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <CreditCard className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <div className="font-semibold">
                          {pm.card.brand.toUpperCase()} •••• {pm.card.last4}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Expire {pm.card.exp_month}/{pm.card.exp_year}
                        </div>
                      </div>
                      {user?.stripePaymentMethodId === pm.id && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Par défaut
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePaymentMethod(pm.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Add payment method */}
          {!showAddForm ? (
            <Button onClick={handleAddPaymentMethod} className="w-full" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un moyen de paiement
            </Button>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Ajouter une carte bancaire</CardTitle>
                <CardDescription>
                  Vos informations bancaires sont sécurisées par Stripe
                </CardDescription>
              </CardHeader>
              <CardContent>
                {clientSecret && (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                      },
                    }}
                  >
                    <SetupForm
                      onSuccess={() => {
                        setShowAddForm(false)
                        setClientSecret(null)
                        fetchPaymentMethods()
                      }}
                      onCancel={() => {
                        setShowAddForm(false)
                        setClientSecret(null)
                      }}
                    />
                  </Elements>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

function SetupForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    try {
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
      })

      if (error) {
        toast.error(error.message || 'Erreur lors de l\'ajout de la carte')
        setLoading(false)
        return
      }

      if (setupIntent?.payment_method) {
        // Attach payment method to user
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/payment-methods`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            paymentMethodId: setupIntent.payment_method,
          }),
        })

        if (res.ok) {
          toast.success('Carte ajoutée avec succès !')
          onSuccess()
        } else {
          const error = await res.json()
          toast.error(error.error || 'Erreur lors de l\'enregistrement')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erreur lors de l\'ajout de la carte')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="flex gap-4">
        <Button type="submit" disabled={!stripe || loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            'Enregistrer la carte'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
