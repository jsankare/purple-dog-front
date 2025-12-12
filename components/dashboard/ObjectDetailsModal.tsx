'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Check, X, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ObjectDetailsModalProps {
  object: any
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function ObjectDetailsModal({ object, isOpen, onClose, onUpdate }: ObjectDetailsModalProps) {
  const [offers, setOffers] = useState<any[]>([])
  const [bids, setBids] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Edit state
  const [newPrice, setNewPrice] = useState(object?.quickSalePrice || object?.auctionStartPrice || 0)
  const [newMode, setNewMode] = useState(object?.saleMode || 'quick_sale')

  useEffect(() => {
    if (isOpen && object) {
      fetchData()
      setNewPrice(object.quickSalePrice || object.auctionStartPrice || 0)
      setNewMode(object.saleMode || 'quick_sale')
    }
  }, [isOpen, object])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch offers
      const offersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/offers?where[object][equals]=${object.id}`, {
        credentials: 'include',
      })
      if (offersRes.ok) {
        const offersData = await offersRes.json()
        setOffers(offersData.docs || [])
      }

      // Fetch bids if auction
      if (object.saleMode === 'auction') {
        const bidsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bids/object/${object.id}`, {
          credentials: 'include',
        })
        if (bidsRes.ok) {
          const bidsData = await bidsRes.json()
          setBids(bidsData.docs || [])
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptOffer = async (offerId: string) => {
    try {
      setIsUpdating(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/offers/${offerId}/accept`, {
        method: 'PUT',
        credentials: 'include',
      })

      if (response.ok) {
        toast.success('Offre acceptée !')
        onUpdate()
        onClose()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de l\'acceptation')
      }
    } catch (error) {
      toast.error('Erreur réseau')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRejectOffer = async (offerId: string) => {
    try {
      setIsUpdating(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/offers/${offerId}/reject`, {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        toast.success('Offre refusée')
        fetchData() // Refresh data
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors du refus')
      }
    } catch (error) {
      toast.error('Erreur réseau')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAcceptBid = async (bidId: string) => {
    try {
      setIsUpdating(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bids/${bidId}/accept`, {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        toast.success('Enchère acceptée !')
        onUpdate()
        onClose()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de l\'acceptation')
      }
    } catch (error) {
      toast.error('Erreur réseau')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdatePrice = async () => {
    if (!newPrice || newPrice <= 0) {
      toast.error('Prix invalide')
      return
    }

    try {
      setIsUpdating(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/objects/${object.id}/update-price`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newPrice }),
      })

      if (response.ok) {
        toast.success('Prix mis à jour !')
        onUpdate()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      toast.error('Erreur réseau')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleChangeMode = async () => {
    if (!newPrice || newPrice <= 0) {
      toast.error('Prix invalide')
      return
    }

    try {
      setIsUpdating(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/objects/${object.id}/change-mode`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newMode, price: newPrice }),
      })

      if (response.ok) {
        toast.success('Mode de vente changé !')
        onUpdate()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors du changement')
      }
    } catch (error) {
      toast.error('Erreur réseau')
    } finally {
      setIsUpdating(false)
    }
  }

  const pendingOffers = offers.filter(o => o.status === 'pending' && o.amount > 0)
  const messages = offers.filter(o => o.amount === 0)
  const hasPendingActivity = pendingOffers.length > 0 || bids.length > 0

  const highestBid = bids.length > 0 ? bids[0] : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{object?.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={object?.saleMode === 'auction' ? 'bids' : 'offers'} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {object?.saleMode === 'auction' && (
              <TabsTrigger value="bids">
                Enchères {bids.length > 0 && `(${bids.length})`}
              </TabsTrigger>
            )}
            {object?.saleMode === 'quick_sale' && (
              <TabsTrigger value="offers">
                Offres {pendingOffers.length > 0 && `(${pendingOffers.length})`}
              </TabsTrigger>
            )}
            <TabsTrigger value="messages">
              Questions {messages.length > 0 && `(${messages.length})`}
            </TabsTrigger>
            <TabsTrigger value="edit">Modifier</TabsTrigger>
          </TabsList>

          {/* Bids Tab */}
          {object?.saleMode === 'auction' && (
            <TabsContent value="bids" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : bids.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucune enchère pour le moment
                </p>
              ) : (
                <div className="space-y-3">
                  {bids.map((bid, index) => {
                    const isHighest = index === 0
                    const bidder = typeof bid.bidder === 'object' ? bid.bidder : null
                    
                    return (
                      <div
                        key={bid.id}
                        className={`p-4 rounded-lg border ${
                          isHighest ? 'bg-green-50 dark:bg-green-950 border-green-500' : 'bg-card'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold">{bid.amount}€</span>
                              {isHighest && (
                                <Badge variant="default" className="bg-green-600">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  Enchère la plus haute
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {bidder?.firstName || 'Enchérisseur'} •{' '}
                              {format(new Date(bid.createdAt), 'PPp', { locale: fr })}
                            </p>
                          </div>
                          {isHighest && (
                            <Button
                              onClick={() => handleAcceptBid(bid.id)}
                              disabled={isUpdating}
                              size="sm"
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  Accepter
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          )}

          {/* Offers Tab */}
          {object?.saleMode === 'quick_sale' && (
            <TabsContent value="offers" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : pendingOffers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucune offre pour le moment
                </p>
              ) : (
                <div className="space-y-3">
                  {pendingOffers.map((offer) => {
                    const buyer = typeof offer.buyer === 'object' ? offer.buyer : null
                    
                    return (
                      <div key={offer.id} className="p-4 rounded-lg border bg-card">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold">{offer.amount}€</span>
                              <Badge variant="outline">{offer.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {buyer?.firstName || 'Acheteur'} •{' '}
                              {format(new Date(offer.createdAt), 'PPp', { locale: fr })}
                            </p>
                            {offer.message && (
                              <p className="mt-2 text-sm italic text-muted-foreground">
                                "{offer.message}"
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleAcceptOffer(offer.id)}
                              disabled={isUpdating}
                              size="sm"
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  Accepter
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => handleRejectOffer(offer.id)}
                              disabled={isUpdating}
                              variant="outline"
                              size="sm"
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <X className="h-4 w-4 mr-2" />
                                  Refuser
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          )}

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucune question pour le moment
              </p>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => {
                  const buyer = typeof msg.buyer === 'object' ? msg.buyer : null
                  
                  return (
                    <div key={msg.id} className="p-4 rounded-lg border bg-card">
                      <p className="text-sm font-medium">
                        {buyer?.firstName || 'Acheteur'} •{' '}
                        {format(new Date(msg.createdAt), 'PPp', { locale: fr })}
                      </p>
                      <p className="mt-2">{msg.message}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Edit Tab */}
          <TabsContent value="edit" className="space-y-6">
            {hasPendingActivity && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Impossible de modifier tant qu'il y a des offres ou enchères en cours
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="price">Prix</Label>
                <Input
                  id="price"
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  disabled={hasPendingActivity || isUpdating}
                />
                <Button
                  onClick={handleUpdatePrice}
                  disabled={hasPendingActivity || isUpdating}
                  className="mt-2"
                  size="sm"
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Mettre à jour le prix
                </Button>
              </div>

              <div>
                <Label htmlFor="mode">Mode de vente</Label>
                <Select
                  value={newMode}
                  onValueChange={setNewMode}
                  disabled={hasPendingActivity || isUpdating}
                >
                  <SelectTrigger id="mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quick_sale">Vente rapide</SelectItem>
                    <SelectItem value="auction">Enchère</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleChangeMode}
                  disabled={hasPendingActivity || isUpdating || newMode === object?.saleMode}
                  className="mt-2"
                  size="sm"
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Changer le mode
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
