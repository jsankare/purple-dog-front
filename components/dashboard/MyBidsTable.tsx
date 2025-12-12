'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BidStatusBadge } from './BidStatusBadge'
import { AuctionTimer } from './AuctionTimer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Bid {
  id: string
  amount: number
  createdAt: string
  object: {
    id: string
    name: string
    photos?: Array<{ url: string; alt?: string }>
    currentBidAmount?: number
    auctionEndDate?: string
    saleMode: 'auction' | 'quick_sale'
  }
}

export function MyBidsTable() {
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('active')

  useEffect(() => {
    fetchBids()
  }, [])

  const fetchBids = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bids/my-bids`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setBids(data.docs || [])
      }
    } catch (error) {
      console.error('Error fetching bids:', error)
    } finally {
      setLoading(false)
    }
  }

  const getBidStatus = (bid: Bid): 'active_leading' | 'active_outbid' | 'won' | 'lost' => {
    const now = new Date()
    const endDate = bid.object.auctionEndDate ? new Date(bid.object.auctionEndDate) : null
    const isActive = endDate && endDate > now
    const isLeading = bid.amount === bid.object.currentBidAmount

    if (!isActive) {
      return isLeading ? 'won' : 'lost'
    }
    return isLeading ? 'active_leading' : 'active_outbid'
  }

  const filterBids = (status: string) => {
    return bids.filter((bid) => {
      const bidStatus = getBidStatus(bid)
      if (status === 'active') {
        return bidStatus === 'active_leading' || bidStatus === 'active_outbid'
      }
      if (status === 'won') {
        return bidStatus === 'won'
      }
      if (status === 'lost') {
        return bidStatus === 'lost'
      }
      return true
    })
  }

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  if (bids.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Vous n'avez pas encore placé d'enchères
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="active">
          En cours ({filterBids('active').length})
        </TabsTrigger>
        <TabsTrigger value="won">
          Gagnées ({filterBids('won').length})
        </TabsTrigger>
        <TabsTrigger value="lost">
          Perdues ({filterBids('lost').length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="space-y-4">
        {filterBids('active').length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Aucune enchère en cours
            </CardContent>
          </Card>
        ) : (
          filterBids('active').map((bid) => (
            <BidCard key={bid.id} bid={bid} status={getBidStatus(bid)} />
          ))
        )}
      </TabsContent>

      <TabsContent value="won" className="space-y-4">
        {filterBids('won').length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Aucune enchère gagnée
            </CardContent>
          </Card>
        ) : (
          filterBids('won').map((bid) => (
            <BidCard key={bid.id} bid={bid} status={getBidStatus(bid)} />
          ))
        )}
      </TabsContent>

      <TabsContent value="lost" className="space-y-4">
        {filterBids('lost').length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Aucune enchère perdue
            </CardContent>
          </Card>
        ) : (
          filterBids('lost').map((bid) => (
            <BidCard key={bid.id} bid={bid} status={getBidStatus(bid)} />
          ))
        )}
      </TabsContent>
    </Tabs>
  )
}

function BidCard({
  bid,
  status,
}: {
  bid: Bid
  status: 'active_leading' | 'active_outbid' | 'won' | 'lost'
}) {
  const photoUrl = bid.object.photos?.[0]?.url || '/placeholder.jpg'

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
            <Image
              src={photoUrl}
              alt={bid.object.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{bid.object.name}</h3>
                <BidStatusBadge status={status} className="mt-1" />
              </div>
              {bid.object.auctionEndDate && (
                <div className="text-sm text-right">
                  <div className="text-muted-foreground">Fin dans :</div>
                  <AuctionTimer endDate={bid.object.auctionEndDate} />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-muted-foreground">Votre enchère : </span>
                <span className="font-semibold">{bid.amount}€</span>
              </div>
              <div>
                <span className="text-muted-foreground">Enchère actuelle : </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {bid.object.currentBidAmount}€
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/objets/${bid.object.id}`}>Voir l'objet</Link>
              </Button>
              {(status === 'active_outbid' || status === 'active_leading') && (
                <Button asChild size="sm">
                  <Link href={`/objets/${bid.object.id}#bid`}>
                    {status === 'active_outbid' ? 'Surenchérir' : 'Augmenter'}
                  </Link>
                </Button>
              )}
              {status === 'won' && (
                <Button asChild size="sm" variant="default">
                  <Link href={`/checkout/${bid.object.id}`}>Valider l'achat</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
