import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { AuctionTimer } from '@/components/objects/AuctionTimer'

interface ObjectCardProps {
  object: {
    id: string
    name: string
    description?: string
    category?: {
      id: string
      name: string
    }
    saleMode: 'auction' | 'quick_sale'
    auctionStartPrice?: number
    quickSalePrice?: number
    currentBidAmount?: number
    auctionEndDate?: string
    // Support both structures (legacy frontend vs Payload)
    images?: Array<{ url: string; alt?: string }>
    photos?: Array<{
      image: {
        url: string
        alt?: string
      } | string // Could be string ID if not populated
    }>
    status: string
    bidCount?: number
  }
  onFavoriteToggle?: (objectId: string) => void
  isFavorite?: boolean
}

export function ObjectCard({ object, onFavoriteToggle, isFavorite = false }: ObjectCardProps) {
  // Logic to extract image URL from Payload structure or legacy structure
  const getMainImageUrl = () => {
    // 1. Try Payload 'photos' array
    if (object.photos && object.photos.length > 0) {
      const firstPhoto = object.photos[0]
      if (typeof firstPhoto.image === 'object' && firstPhoto.image?.url) {
        return firstPhoto.image.url
      }
    }
    
    // 2. Try legacy 'images' array
    if (object.images && object.images.length > 0) {
      return object.images[0].url
    }
    
    // 3. Fallback
    return '/placeholder-object.jpg'
  }

  const imageUrl = getMainImageUrl()
  
  const price = object.saleMode === 'auction' 
    ? (object.currentBidAmount || object.auctionStartPrice || 0)
    : (object.quickSalePrice || 0)

  const isAuction = object.saleMode === 'auction'
  const isActive = object.status === 'active'

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/objets/${object.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={object.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            <Badge variant={isActive ? 'default' : 'secondary'}>
              {object.status === 'active' ? 'Actif' : 
               object.status === 'sold' ? 'Vendu' : 
               object.status === 'expired' ? 'Expiré' : object.status}
            </Badge>
          </div>

          {/* Sale Mode Badge */}
          <div className="absolute top-2 right-2">
            <Badge variant={isAuction ? 'destructive' : 'default'}>
              {isAuction ? '🔨 Enchère' : '⚡ Vente rapide'}
            </Badge>
          </div>

          {/* Favorite Button */}
          {onFavoriteToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.preventDefault()
                onFavoriteToggle(object.id)
              }}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </Button>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/objets/${object.id}`}>
          <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
            {object.name}
          </h3>
          
          {object.category && (
            <p className="text-sm text-muted-foreground mt-1">
              {object.category.name}
            </p>
          )}

          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {price.toLocaleString('fr-FR')} €
              </span>
              {isAuction && object.bidCount !== undefined && object.bidCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  ({object.bidCount} enchère{object.bidCount > 1 ? 's' : ''})
                </span>
              )}
            </div>
            
            {isAuction && object.currentBidAmount && object.auctionStartPrice && 
             object.currentBidAmount > object.auctionStartPrice && (
              <p className="text-xs text-muted-foreground mt-1">
                Prix de départ : {object.auctionStartPrice.toLocaleString('fr-FR')} €
              </p>
            )}
          </div>
        </Link>
      </CardContent>

      {isAuction && object.auctionEndDate && isActive && (
        <CardFooter className="p-4 pt-0">
          <AuctionTimer endDate={object.auctionEndDate} />
        </CardFooter>
      )}
    </Card>
  )
}
