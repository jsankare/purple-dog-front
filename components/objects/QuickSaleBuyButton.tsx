'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface QuickSaleBuyButtonProps {
  objectId: string
  price: number
  disabled?: boolean
}

export function QuickSaleBuyButton({ objectId, price, disabled }: QuickSaleBuyButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    setLoading(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/objects/${objectId}/purchase`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )

      if (!res.ok) {
        const error = await res.json()
        
        if (error.code === 'PAYMENT_METHOD_REQUIRED') {
          toast.error('Vous devez ajouter un moyen de paiement avant d\'acheter', {
            action: {
              label: 'Ajouter',
              onClick: () => router.push('/dashboard/profile/payment-methods'),
            },
          })
          return
        }

        toast.error(error.error || 'Erreur lors de l\'achat')
        return
      }

      const data = await res.json()
      
      toast.success('Achat initié avec succès !')
      
      // Redirect to checkout
      router.push(`/checkout/${data.transaction.id}`)
    } catch (error) {
      console.error('Error purchasing object:', error)
      toast.error('Erreur lors de l\'achat')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePurchase}
      disabled={disabled || loading}
      size="lg"
      className="w-full"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Traitement...
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Acheter maintenant - {price.toLocaleString('fr-FR')}€
        </>
      )}
    </Button>
  )
}
