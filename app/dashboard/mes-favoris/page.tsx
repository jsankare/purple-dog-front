'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { favoritesAPI } from '@/lib/api'
import { ObjectCard } from '@/components/objects'
import { Loader2, Heart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function MesFavorisPage() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<any[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true)
      try {
        const result = await favoritesAPI.getAll()
        const favDocs = result.docs || []
        setFavorites(favDocs)
        
        // Create set of favorite object IDs
        const ids = new Set<string>(
          favDocs.map((fav: any) => 
            typeof fav.object === 'string' ? fav.object : fav.object?.id
          ).filter((id: any): id is string => typeof id === 'string')
        )
        setFavoriteIds(ids)
      } catch (error) {
        console.error('Error fetching favorites:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchFavorites()
    }
  }, [user])

  const handleFavoriteToggle = async (objectId: string) => {
    try {
      const result = await favoritesAPI.toggle(objectId)
      
      if (result.isFavorite) {
        // Added to favorites - shouldn't happen on this page
        setFavoriteIds(prev => new Set([...prev, objectId]))
      } else {
        // Removed from favorites
        setFavoriteIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(objectId)
          return newSet
        })
        
        // Remove from list
        setFavorites(prev => prev.filter(fav => {
          const favObjId = typeof fav.object === 'string' ? fav.object : fav.object?.id
          return favObjId !== objectId
        }))
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Heart className="h-8 w-8 text-red-500 fill-red-500" />
          Mes Favoris
        </h1>
        <p className="text-muted-foreground mt-2">
          {favorites.length} objet{favorites.length > 1 ? 's' : ''} dans vos favoris
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Aucun favori</h2>
          <p className="text-muted-foreground mb-6">
            Vous n'avez pas encore ajouté d'objets à vos favoris.
          </p>
          <Button asChild>
            <Link href="/catalogue">
              Parcourir le catalogue
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => {
            const object = typeof favorite.object === 'string' 
              ? null 
              : favorite.object
            
            if (!object) return null

            return (
              <ObjectCard
                key={favorite.id}
                object={object}
                isFavorite={favoriteIds.has(object.id)}
                onFavoriteToggle={handleFavoriteToggle}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
