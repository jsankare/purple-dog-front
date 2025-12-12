'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowLeft, ShieldCheck, Heart, Share2, Loader2, Gavel } from 'lucide-react'
import { AuctionTimer, BidForm, BidHistory, QuickSaleBuyButton, OfferForm } from '@/components/objects'
import { objectsAPI, favoritesAPI } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

export default function ObjetDetailPage() {
  const params = useParams()
  const { user, isAuthenticated } = useAuth()
  const [object, setObject] = useState<any>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchObject = async () => {
      try {
        const result = await objectsAPI.getById(params.id as string)
        console.log('GET Object details result:', result)
        setObject(result)
        setError(null)
      } catch (error: any) {
        console.error('Error fetching object:', error)
        setError(error.message || 'Erreur lors du chargement de l\'objet')
      } finally {
        setIsLoading(false)
      }
    }

    fetchObject()
  }, [params.id])

  // Check if favorite
  useEffect(() => {
    const checkFavorite = async () => {
      if (!isAuthenticated) return
      
      try {
        const result = await favoritesAPI.getAll()
        const isFav = (result.docs || []).some((fav: any) => {
          const favObjectId = typeof fav.object === 'string' ? fav.object : fav.object?.id
          return favObjectId === params.id
        })
        setIsFavorite(isFav)
      } catch (error) {
        console.log('Could not check favorite status')
      }
    }

    checkFavorite()
  }, [params.id, isAuthenticated])

  const handleFavoriteToggle = async () => {
    try {
      const result = await favoritesAPI.toggle(params.id as string)
      setIsFavorite(result.isFavorite)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleBidPlaced = () => {
    // Refresh object data
    objectsAPI.getById(params.id as string).then(setObject)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !object) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Objet non trouvé</h1>
        {error && <p className="text-muted-foreground mt-2">{error}</p>}
        <Link href="/catalogue">
          <Button className="mt-4">Retour au catalogue</Button>
        </Link>
      </div>
    )
  }

  const isAuction = object.saleMode === 'auction'
  const price = isAuction 
    ? (object.currentBidAmount || object.auctionStartPrice || 0)
    : (object.quickSalePrice || 0)
  
  // Normalize images from Payload 'photos' or legacy 'images'
  let images = []
  if (object.photos && object.photos.length > 0) {
    images = object.photos.map((p: any) => {
      if (typeof p.image === 'object' && p.image?.url) {
        return { url: p.image.url, alt: p.name || object.name }
      }
      return null
    }).filter(Boolean)
  } else if (object.images && object.images.length > 0) {
    images = object.images
  }
  
  // Fallback if no images
  if (images.length === 0) {
    images = [{ url: '/placeholder-object.jpg', alt: 'Placeholder' }]
  }

  const currentImage = images[currentImageIndex]

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Retour */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0 hover:pl-2 transition-all">
          <Link href="/catalogue">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au catalogue
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Colonne Gauche : Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-xl relative overflow-hidden">
            {currentImage ? (
              <Image
                src={currentImage.url}
                alt={object.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Aucune image
              </div>
            )}
            <Badge 
              className="absolute top-4 left-4" 
              variant={isAuction ? 'destructive' : 'default'}
            >
              {isAuction ? '🔨 Enchère' : '⚡ Vente rapide'}
            </Badge>
          </div>
          
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((img: any, index: number) => (
                <div
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square bg-muted rounded-lg cursor-pointer hover:ring-2 hover:ring-primary transition-all relative overflow-hidden ${
                    index === currentImageIndex ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`${object.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Colonne Droite : Infos & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {object.category && (
                  <Badge variant="outline" className="mb-2">
                    {typeof object.category === 'string' 
                      ? object.category 
                      : (object.category.name || 'Catégorie inconnue')}
                  </Badge>
                )}
                <h1 className="text-3xl font-bold tracking-tight mb-2">{object.name}</h1>
                <p className="text-3xl text-primary font-bold">
                  {price.toLocaleString('fr-FR')} €
                </p>
                {isAuction && object.bidCount > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {object.bidCount} enchère{object.bidCount > 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {isAuthenticated && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleFavoriteToggle}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                )}
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {isAuction && object.auctionEndDate && object.status === 'active' && (
              <div className="mt-4">
                <AuctionTimer endDate={object.auctionEndDate} />
              </div>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {object.description}
            </p>
            
            {object.dimensions && (
              <div className="mt-4 bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Dimensions</h4>
                <div className="text-sm text-muted-foreground grid grid-cols-2 gap-2">
                  <p>H: {object.dimensions.height} cm</p>
                  <p>L: {object.dimensions.width} cm</p>
                  <p>P: {object.dimensions.depth} cm</p>
                  <p>Poids: {object.dimensions.weight} kg</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Bid Form for Auctions */}
          {isAuction && object.status === 'active' && isAuthenticated && (
            <div className="bg-card/50 p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Placer une enchère
              </h3>
              
              {user?.id === (typeof object.seller === 'string' ? object.seller : object.seller?.id) ? (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-amber-600 dark:text-amber-400 text-sm flex items-center gap-2">
                   <ShieldCheck className="h-4 w-4 shrink-0" />
                   <span>Vous êtes le vendeur de cet objet. Vous ne pouvez pas enchérir dessus.</span>
                </div>
              ) : user?.role !== 'professionnel' ? (
                 <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-600 dark:text-blue-400 text-sm">
                   <p className="font-semibold mb-1">Réservé aux professionnels</p>
                   <p className="mb-3">Seuls les comptes professionnels peuvent participer aux enchères.</p>
                   <Link href="/register" className="text-primary hover:underline font-medium">
                     Créer un compte pro &rarr;
                   </Link>
                 </div>
              ) : (
                <BidForm
                  objectId={object.id}
                  currentBidAmount={object.currentBidAmount || object.auctionStartPrice || 0}
                  minBidIncrement={
                    price < 100 ? 10 :
                    price < 500 ? 50 :
                    price < 1000 ? 100 :
                    price < 5000 ? 200 : 500
                  }
                  onBidPlaced={handleBidPlaced}
                />
              )}
            </div>
          )}

          {/* Quick Sale Button - Only for logged in users */}
          {!isAuction && object.status === 'active' && isAuthenticated && (
            <div className="flex flex-col gap-3">
              {user?.id === (typeof object.seller === 'string' ? object.seller : object.seller?.id) ? (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-amber-600 dark:text-amber-400 text-sm flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Vous êtes le vendeur de cet objet. Vous ne pouvez pas l'acheter.</span>
                </div>
              ) : user?.role !== 'professionnel' ? (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-600 dark:text-blue-400 text-sm">
                  <p className="font-semibold mb-1">Réservé aux professionnels</p>
                  <p className="mb-3">Seuls les comptes professionnels peuvent acheter des objets.</p>
                  <Link href="/register" className="text-primary hover:underline font-medium">
                    Créer un compte pro &rarr;
                  </Link>
                </div>
              ) : (
                <>
                  <QuickSaleBuyButton 
                    objectId={object.id}
                    price={object.quickSalePrice || 0}
                  />
                  <OfferForm
                    objectId={object.id}
                    objectName={object.name}
                    currentPrice={object.quickSalePrice || 0}
                  />
                  <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Paiement sécurisé & Protection acheteur
                  </p>
                </>
              )}
            </div>
          )}

          {!isAuthenticated && (
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {isAuction 
                  ? "Connectez-vous avec un compte professionnel pour enchérir" 
                  : "Connectez-vous pour acheter"}
              </p>
              <div className="flex flex-col gap-2 justify-center items-center">
                <Link href={`/login?redirect=/objets/${object.id}`} className="w-full">
                  <Button className="w-full">Se connecter</Button>
                </Link>
                {isAuction && (
                  <Link href="/register" className="text-xs text-primary hover:underline">
                    Pas encore de compte pro ? S'inscrire
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bid History for Auctions - Only Pro */}
      {isAuction && user?.role === 'professionnel' && (
        <div className="mt-12">
          <BidHistory 
            objectId={object.id} 
            sellerId={typeof object.seller === 'string' ? object.seller : object.seller?.id}
          />
        </div>
      )}
    </div>
  )
}
