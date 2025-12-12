'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Gavel } from 'lucide-react'
import { bidsAPI } from '@/lib/api'

interface BidFormProps {
  objectId: string
  currentBidAmount: number
  minBidIncrement: number
  onBidPlaced?: () => void
}

export function BidForm({ objectId, currentBidAmount, minBidIncrement, onBidPlaced }: BidFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const minAmount = currentBidAmount + minBidIncrement

  const formSchema = z.object({
    amount: z.number({
      message: "Montant invalide",
    })
    .min(minAmount, `L'enchère doit être d'au moins ${minAmount.toLocaleString('fr-FR')} €`),
  })

  type BidFormData = z.infer<typeof formSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BidFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: minAmount,
    },
  })

  const onSubmit = async (data: BidFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await bidsAPI.placeBid({
        objectId,
        amount: data.amount,
      })

      setSuccess(true)
      
      // Calculate new min amount for reset
      const newMinAmount = data.amount + minBidIncrement
      reset({ amount: newMinAmount })
      
      if (onBidPlaced) {
        onBidPlaced()
      }

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      // Check if error is payment method required
      if (err.code === 'PAYMENT_METHOD_REQUIRED' || err.message?.includes('payment method')) {
        setError('Vous devez ajouter un moyen de paiement avant d\'enchérir')
      } else {
        setError(err.message || 'Erreur lors de la placement de l\'enchère')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Votre enchère</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              €
            </span>
          </div>
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enchère...
              </>
            ) : (
              <>
                <Gavel className="mr-2 h-4 w-4" />
                Enchérir
              </>
            )}
          </Button>
        </div>
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Enchère minimum : {minAmount.toLocaleString('fr-FR')} €
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            {error.includes('moyen de paiement') && (
              <div className="mt-2">
                <Link href="/dashboard/profile/payment-methods">
                  <Button variant="outline" size="sm" className="mt-2">
                    Ajouter un moyen de paiement
                  </Button>
                </Link>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100 border-green-200 dark:border-green-800">
          <AlertDescription>✅ Enchère placée avec succès !</AlertDescription>
        </Alert>
      )}
    </form>
  )
}
