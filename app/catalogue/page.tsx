'use client'

import { useState, useEffect } from 'react'
import { ObjectCard, ObjectFilters, type ObjectFiltersType } from '@/components/objects'
import { objectsAPI, favoritesAPI } from '@/lib/api'
import { Loader2 } from 'lucide-react'

export default function CataloguePage() {
  const [allObjects, setAllObjects] = useState<any[]>([])
  const [filteredObjects, setFilteredObjects] = useState<any[]>([])
  const [objects, setPaginatedObjects] = useState<any[]>([]) // Objects to display on current page
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState<ObjectFiltersType>({ status: 'active' })
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const ITEMS_PER_PAGE = 12

  // Fetch ALL objects once
  useEffect(() => {
    const fetchObjects = async () => {
      setIsLoading(true)
      try {
        // Fetch all active objects (limit 1000 for hackathon scale)
        const result = await objectsAPI.getAll({
          limit: 1000,
          status: 'active' // Only fetch active ones from backend base
        })
        setAllObjects(result.docs || [])
      } catch (error) {
        console.error('Error fetching objects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchObjects()
  }, [])

  // Apply Filters Client-Side
  useEffect(() => {
    let result = [...allObjects]

    // 1. Search (Name OR Description)
    if (filters.search) {
      const query = filters.search.toLowerCase()
      result = result.filter(obj => 
        (obj.name?.toLowerCase().includes(query)) || 
        (obj.description?.toLowerCase().includes(query))
      )
    }

    // 2. Category
    if (filters.category && filters.category !== 'all') {
      // Handle both populated object or ID string
      result = result.filter(obj => {
        const catId = typeof obj.category === 'string' ? obj.category : obj.category?.id
        return catId === filters.category
      })
    }

    // 3. Sale Mode
    if (filters.saleMode) {
      result = result.filter(obj => obj.saleMode === filters.saleMode)
    }

    // 4. Status (Already filtered request-side but keeping for safety if filter changes)
    if (filters.status && filters.status !== 'all') {
      result = result.filter(obj => obj.status === filters.status)
    }

    // 5. Price Range
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      result = result.filter(obj => {
        // Determine price to check based on sale mode
        const price = obj.saleMode === 'auction' 
          ? (obj.currentBidAmount || obj.auctionStartPrice)
          : obj.quickSalePrice
        
        const min = filters.minPrice || 0
        const max = filters.maxPrice || 100000
        
        return price >= min && price <= max
      })
    }

    setFilteredObjects(result)
    setTotalPages(Math.ceil(result.length / ITEMS_PER_PAGE))
    setPage(1) // Reset to page 1 on filter change
  }, [filters, allObjects])

  // Apply Pagination
  useEffect(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    setPaginatedObjects(filteredObjects.slice(start, end))
  }, [page, filteredObjects])

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const result = await favoritesAPI.getAll()
        const favoriteIds = new Set<string>(
          (result.docs || []).map((fav: any) => 
            typeof fav.object === 'string' ? fav.object : fav.object?.id
          ).filter((id: any): id is string => typeof id === 'string')
        )
        setFavorites(favoriteIds)
      } catch (error) {
        // User not logged in or error - ignore
        console.log('Could not fetch favorites:', error)
      }
    }

    fetchFavorites()
  }, [])

  const handleFavoriteToggle = async (objectId: string) => {
    try {
      const result = await favoritesAPI.toggle(objectId)
      
      if (result.isFavorite) {
        setFavorites(prev => new Set([...prev, objectId]))
      } else {
        setFavorites(prev => {
          const newSet = new Set(prev)
          newSet.delete(objectId)
          return newSet
        })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleFilterChange = (newFilters: ObjectFiltersType) => {
    setFilters(newFilters)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filtres */}
        <aside className="w-full md:w-80 h-fit sticky top-24">
          <ObjectFilters 
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
        </aside>

        {/* Grille de Produits */}
        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Catalogue
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLoading ? 'Chargement...' : `${filteredObjects.length} objet${filteredObjects.length > 1 ? 's' : ''} trouvé${filteredObjects.length > 1 ? 's' : ''}`}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : objects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Aucun objet trouvé avec ces filtres.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Essayez de modifier vos critères de recherche.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {objects.map((object) => (
                  <ObjectCard
                    key={object.id}
                    object={object}
                    isFavorite={favorites.has(object.id)}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} sur {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
