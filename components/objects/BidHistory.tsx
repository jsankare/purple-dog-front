'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, TrendingUp } from 'lucide-react'
import { bidsAPI } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Bid {
  id: string
  amount: number
  bidder: {
    id: string
    firstName?: string
    lastName?: string
    email: string
  }
  status: string
  createdAt: string
}

interface BidHistoryProps {
  objectId: string
  sellerId?: string
  autoRefresh?: boolean
  refreshInterval?: number
}

export function BidHistory({ objectId, sellerId, autoRefresh = true, refreshInterval = 10000 }: BidHistoryProps) {
  const { user, isAuthenticated } = useAuth()
  const [bids, setBids] = useState<Bid[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBids = async () => {
    try {
      const result = await bidsAPI.getObjectBids(objectId)
      setBids(result.docs || [])
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des enchères')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBids()

    if (autoRefresh) {
      const interval = setInterval(fetchBids, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [objectId, autoRefresh, refreshInterval])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          {error}
        </CardContent>
      </Card>
    )
  }



  if (bids.length === 0) {
    const isSeller = user?.id === sellerId
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Aucune enchère pour le moment. {isSeller ? '' : 'Soyez le premier à enchérir ! 🚀'}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Historique des enchères ({bids.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bids.map((bid, index) => (
            <div
              key={bid.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                bid.status === 'highest' ? 'bg-green-50 border-green-200' : 'bg-muted/30'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {bid.bidder.firstName && bid.bidder.lastName
                      ? `${bid.bidder.firstName} ${bid.bidder.lastName.charAt(0)}.`
                      : bid.bidder.email.split('@')[0]}
                  </span>
                  {bid.status === 'highest' && (
                    <Badge variant="default" className="bg-green-600">
                      Enchère la plus haute
                    </Badge>
                  )}
                  {index === 0 && bid.status !== 'highest' && (
                    <Badge variant="secondary">Dernière enchère</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(bid.createdAt), 'PPp', { locale: fr })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">
                  {bid.amount.toLocaleString('fr-FR')} €
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
