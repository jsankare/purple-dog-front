'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Loader2, Package, CreditCard, Truck } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Transaction {
  id: string
  object: {
    id: string
    name: string
    photos?: Array<{ url: string; image?: { url: string } }>
  }
  finalPrice: number
  buyerCommission: number
  sellerCommission: number
  shippingCost: number
  totalAmount: number
  status: string
  shippingAddress?: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  billingAddress?: {
    street: string
    city: string
    postalCode: string
    country: string
  }
}

const SHIPPING_OPTIONS = [
  { id: 'standard', name: 'Colissimo Standard', price: 8.5, delay: '3-5 jours' },
  { id: 'express', name: 'Chronopost Express', price: 15, delay: '24-48h' },
  { id: 'cocolis', name: 'Cocolis', price: 12, delay: '3-7 jours' },
]

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const transactionId = params.id as string

  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  // Form state
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
  })
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
  })
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_OPTIONS[0])

  useEffect(() => {
    fetchTransaction()
  }, [transactionId])

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress(shippingAddress)
    }
  }, [sameAsShipping, shippingAddress])

  // Pre-fill addresses from transaction when loaded
  useEffect(() => {
    if (transaction) {
      if (transaction.shippingAddress?.street) {
        setShippingAddress({
          street: transaction.shippingAddress.street || '',
          city: transaction.shippingAddress.city || '',
          postalCode: transaction.shippingAddress.postalCode || '',
          country: transaction.shippingAddress.country || 'France',
        })
      }
      if (transaction.billingAddress?.street) {
        setBillingAddress({
          street: transaction.billingAddress.street || '',
          city: transaction.billingAddress.city || '',
          postalCode: transaction.billingAddress.postalCode || '',
          country: transaction.billingAddress.country || 'France',
        })
      }
    }
  }, [transaction])

  const fetchTransaction = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${transactionId}`,
        { credentials: 'include' }
      )
      if (res.ok) {
        const data = await res.json()
        setTransaction(data)
      } else {
        toast.error('Transaction introuvable')
        router.push('/dashboard/mes-achats')
      }
    } catch (error) {
      console.error('Error fetching transaction:', error)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelTransaction = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cet achat ? L\'objet sera remis en vente.')) {
      return
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${transactionId}/cancel`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      if (res.ok) {
        toast.success('Achat annulé avec succès')
        router.push('/dashboard/mes-achats')
      } else {
        const error = await res.json()
        toast.error(error.error || 'Erreur lors de l\'annulation')
      }
    } catch (error) {
      console.error('Error cancelling transaction:', error)
      toast.error('Erreur lors de l\'annulation')
    }
  }

  const handleProceedToPayment = async () => {
    // Validate addresses
    const requiredFields = ['street', 'city', 'postalCode', 'country']
    for (const field of requiredFields) {
      if (!shippingAddress[field as keyof typeof shippingAddress]) {
        toast.error(`Veuillez remplir tous les champs de l'adresse de livraison`)
        return
      }
      if (!sameAsShipping && !billingAddress[field as keyof typeof billingAddress]) {
        toast.error(`Veuillez remplir tous les champs de l'adresse de facturation`)
        return
      }
    }

    try {
      // Create Payment Intent
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${transactionId}/payment-intent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            shippingAddress,
            billingAddress: sameAsShipping ? shippingAddress : billingAddress,
            shippingCarrier: selectedShipping.name,
            shippingCost: selectedShipping.price,
          }),
        }
      )

      if (!res.ok) {
        const error = await res.json()
        toast.error(error.error || 'Erreur lors de la création du paiement')
        return
      }

      const data = await res.json()
      setClientSecret(data.clientSecret)
    } catch (error) {
      console.error('Error creating payment intent:', error)
      toast.error('Erreur lors de la création du paiement')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!transaction) {
    return null
  }

  // Extract first image URL from object photos
  let imageUrl = '/placeholder.jpg'
  if (transaction.object.photos && transaction.object.photos.length > 0) {
    const firstPhoto = transaction.object.photos[0]
    if (typeof firstPhoto.image === 'object' && firstPhoto.image?.url) {
      imageUrl = firstPhoto.image.url
    } else if (typeof firstPhoto === 'object' && firstPhoto.url) {
      imageUrl = firstPhoto.url
    }
  }

  const totalWithShipping = transaction.finalPrice + transaction.buyerCommission + selectedShipping.price

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Finaliser votre achat</h1>
        <p className="text-muted-foreground">
          Complétez les informations de livraison et procédez au paiement
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Adresse de livraison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="street">Rue</Label>
                <Input
                  id="street"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  placeholder="123 Rue de la Paix"
                  disabled={!!clientSecret}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    placeholder="75001"
                    disabled={!!clientSecret}
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    placeholder="Paris"
                    disabled={!!clientSecret}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                  disabled={!!clientSecret}
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipping Options */}
          <Card>
            <CardHeader>
              <CardTitle>Mode de livraison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {SHIPPING_OPTIONS.map((option) => (
                <div
                  key={option.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedShipping.id === option.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  } ${clientSecret ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !clientSecret && setSelectedShipping(option)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{option.name}</div>
                      <div className="text-sm text-muted-foreground">{option.delay}</div>
                    </div>
                    <div className="font-semibold">{option.price.toFixed(2)}€</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Section */}
          {clientSecret && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Paiement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                    },
                  }}
                >
                  <PaymentForm
                    transactionId={transactionId}
                    totalAmount={totalWithShipping}
                  />
                </Elements>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column - Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Récapitulatif
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Object preview */}
              <Link href={`/objets/${transaction.object.id}`} className="flex gap-3 hover:opacity-80 transition-opacity">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={transaction.object.name}
                    fill
                    className="object-cover"
                    loading="eager"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-2">{transaction.object.name}</h3>
                </div>
              </Link>

              <Separator />

              {/* Price breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Prix de vente</span>
                  <span>{transaction.finalPrice.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Commission (3%)</span>
                  <span>{transaction.buyerCommission.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Livraison</span>
                  <span>{selectedShipping.price.toFixed(2)}€</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{totalWithShipping.toFixed(2)}€</span>
                </div>
              </div>

              {!clientSecret && (
                <>
                  <Button
                    onClick={handleProceedToPayment}
                    className="w-full"
                    size="lg"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Procéder au paiement
                  </Button>
                  <Button
                    onClick={handleCancelTransaction}
                    variant="destructive"
                    className="w-full"
                    size="lg"
                  >
                    Annuler l'achat
                  </Button>
                </>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Paiement sécurisé par Stripe. Vos fonds seront bloqués jusqu'à confirmation de livraison.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function PaymentForm({ transactionId, totalAmount }: { transactionId: string; totalAmount: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/checkout/success?transaction_id=${transactionId}`,
        },
      })

      if (error) {
        toast.error(error.message || 'Erreur lors du paiement')
        setLoading(false)
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Erreur lors du paiement')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Traitement...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Payer {totalAmount.toFixed(2)}€
          </>
        )}
      </Button>
    </form>
  )
}
