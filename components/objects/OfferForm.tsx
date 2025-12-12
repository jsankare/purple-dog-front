'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { offersAPI } from '@/lib/api'

interface OfferFormProps {
  objectId: string
  objectName: string
  currentPrice: number
}

export function OfferForm({ objectId, objectName, currentPrice }: OfferFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const offerAmount = parseFloat(amount)
    
    if (!offerAmount || offerAmount <= 0) {
      toast.error('Veuillez entrer un montant valide')
      return
    }

    setIsSubmitting(true)

    try {
      await offersAPI.makeOffer({
        objectId,
        amount: offerAmount,
        message: message.trim() || undefined,
      })

      toast.success('Offre envoyée au vendeur !')
      setIsOpen(false)
      setAmount('')
      setMessage('')
    } catch (error: any) {
      console.error('Error making offer:', error)
      toast.error(error.message || 'Erreur lors de l\'envoi de l\'offre')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="w-full">
          Faire une offre
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Faire une offre</DialogTitle>
            <DialogDescription>
              Proposez votre prix pour <strong>{objectName}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Montant de votre offre (€) *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder={`Prix actuel : ${currentPrice}€`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Prix actuel : {currentPrice}€
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">
                Message (optionnel)
              </Label>
              <Textarea
                id="message"
                placeholder="Ajoutez un message pour le vendeur..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Les informations personnelles (email, téléphone) seront filtrées
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Envoyer l'offre
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
