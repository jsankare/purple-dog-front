'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Transaction {
  id: string
  object: {
    id: string
    name: string
    photos?: Array<{ url: string; alt?: string; image?: { url: string } }>
  }
  totalAmount: number
  finalPrice: number
  status: string
  createdAt: string
  deliveryStatus?: string
}

export function MyPurchasesTable() {
  const [purchases, setPurchases] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions/my-purchases`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setPurchases(data.docs || [])
      }
    } catch (error) {
      console.error('Error fetching purchases:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending_payment: {
        label: 'En attente paiement',
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-300',
      },
      payment_held: {
        label: 'Paiement validé',
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300',
      },
      in_transit: {
        label: 'En livraison',
        className: 'bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-300',
      },
      delivered: {
        label: 'Livré',
        className: 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300',
      },
      completed: {
        label: 'Terminé',
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-950/30 dark:text-gray-300',
      },
    }

    const variant = variants[status] || variants.pending_payment

    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    )
  }

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  if (purchases.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Vous n'avez pas encore effectué d'achats
        </CardContent>
      </Card>
    )
  }

  const handleCancelPurchase = async (transactionId: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir annuler cet achat ? L'objet sera remis en vente.`)) {
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
        fetchPurchases()
      } else {
        const error = await res.json()
        toast.error(error.error || `Erreur lors de l'annulation`)
      }
    } catch (error) {
      console.error('Error cancelling purchase:', error)
      toast.error(`Erreur lors de l'annulation`)
    }
  }

  return (
    <div className="space-y-4">
      {purchases.map((purchase) => {
        // Extract first image URL from object photos
        let imageUrl = '/placeholder.jpg'
        if (purchase.object.photos && purchase.object.photos.length > 0) {
          const firstPhoto = purchase.object.photos[0]
          if (typeof firstPhoto.image === 'object' && firstPhoto.image?.url) {
            imageUrl = firstPhoto.image.url
          } else if (typeof firstPhoto === 'object' && firstPhoto.url) {
            imageUrl = firstPhoto.url
          }
        }

        return (
        <Card key={purchase.id}>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Link href={`/objets/${purchase.object.id}`} className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden hover:opacity-80 transition-opacity">
                <Image
                  src={imageUrl}
                  alt={purchase.object.name}
                  fill
                  className="object-cover"
                  loading="eager"
                />
              </Link>

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{purchase.object.name}</h3>
                    {getStatusBadge(purchase.status)}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Montant</div>
                    <div className="text-lg font-bold">{purchase.totalAmount.toFixed(2)}€</div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Acheté le {new Date(purchase.createdAt).toLocaleDateString('fr-FR')}
                </div>

                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/objets/${purchase.object.id}`}>Voir l'objet</Link>
                  </Button>
                  {(purchase.status === 'pending_payment' || purchase.status === 'payment_pending') && (
                    <>
                      <Button asChild size="sm">
                        <Link href={`/checkout/${purchase.id}`}>Payer maintenant</Link>
                      </Button>
                      <Button 
                        onClick={() => handleCancelPurchase(purchase.id)}
                        variant="destructive" 
                        size="sm"
                      >
                        Annuler l'achat
                      </Button>
                    </>
                  )}
                  {purchase.status === 'delivered' && (
                    <Button asChild size="sm" variant="default">
                      <Link href={`/transactions/${purchase.id}/confirm`}>
                        Confirmer réception
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        )
      })}
    </div>
  )
}
