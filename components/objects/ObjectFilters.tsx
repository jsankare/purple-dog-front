'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Filter, X, Search } from 'lucide-react'
import { categoriesAPI } from '@/lib/api'

export interface ObjectFilters {
  category?: string
  saleMode?: 'auction' | 'quick_sale'
  status?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}

interface ObjectFiltersProps {
  onFilterChange: (filters: ObjectFilters) => void
  initialFilters?: ObjectFilters
}

export function ObjectFilters({ onFilterChange, initialFilters = {} }: ObjectFiltersProps) {
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [filters, setFilters] = useState<ObjectFilters>(initialFilters)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])

  useEffect(() => {
    // Fetch categories
    categoriesAPI.getAll({ limit: 100 }).then((result) => {
      setCategories(result.docs || [])
    }).catch((err) => {
      console.error('Error fetching categories:', err)
    })
  }, [])

  const handleFilterChange = (key: keyof ObjectFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]])
    const newFilters = {
      ...filters,
      minPrice: values[0],
      maxPrice: values[1],
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    const emptyFilters: ObjectFilters = {}
    setFilters(emptyFilters)
    setPriceRange([0, 100000])
    onFilterChange(emptyFilters)
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <X className="h-4 w-4 mr-1" />
              Réinitialiser
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Filter */}
        <div className="space-y-2">
          <Label>Recherche</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un objet..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Catégorie</Label>
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sale Mode Filter */}
        <div className="space-y-2">
          <Label>Type de vente</Label>
          <Select
            value={filters.saleMode || 'all'}
            onValueChange={(value) => handleFilterChange('saleMode', value === 'all' ? undefined : value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="auction">🔨 Enchères</SelectItem>
              <SelectItem value="quick_sale">⚡ Vente rapide</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label>Statut</Label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="sold">Vendu</SelectItem>
              <SelectItem value="expired">Expiré</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-4">
          <Label>Fourchette de prix</Label>
          <div className="px-2">
            <Slider
              min={0}
              max={100000}
              step={100}
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
                Min
              </Label>
              <Input
                id="minPrice"
                type="number"
                value={priceRange[0]}
                onChange={(e) => handlePriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                Max
              </Label>
              <Input
                id="maxPrice"
                type="number"
                value={priceRange[1]}
                onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value) || 100000])}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
