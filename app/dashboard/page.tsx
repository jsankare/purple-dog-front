'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, TrendingUp, DollarSign, Loader2 } from 'lucide-react'
import { objectsAPI, transactionsAPI } from '@/lib/api'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    activeObjects: 0,
    soldObjects: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    // Pro only
    activeBids: 0,
    wonAuctions: 0,
    favoriteObjects: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  const isPro = user?.role === 'professionnel'
  const isParticulier = user?.role === 'particulier'

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      try {
        // Fetch all objects
        const objectsResult = await objectsAPI.getAll({ limit: 100 })
        const myObjects = (objectsResult.docs || []).filter((obj: any) => {
          const sellerId = typeof obj.seller === 'string' ? obj.seller : obj.seller?.id
          return sellerId === user.id
        })

        const activeCount = myObjects.filter((obj: any) => obj.status === 'active').length
        const soldCount = myObjects.filter((obj: any) => obj.status === 'sold').length

        // Fetch sales transactions
        const salesResult = await transactionsAPI.getMySales()
        const sales = salesResult.docs || []

        const totalRevenue = sales
          .filter((t: any) => t.status === 'completed')
          .reduce((sum: number, t: any) => sum + (t.amount || 0), 0)

        const pendingRevenue = sales
          .filter((t: any) => ['pending', 'held'].includes(t.status))
          .reduce((sum: number, t: any) => sum + (t.amount || 0), 0)

        const newStats: any = {
          activeObjects: activeCount,
          soldObjects: soldCount,
          totalRevenue,
          pendingRevenue,
        }

        // Fetch pro-specific stats
        if (user.role === 'professionnel') {
          // TODO: Fetch bids, won auctions, and favorites when APIs are ready
          // For now, set to 0
          newStats.activeBids = 0
          newStats.wonAuctions = 0
          newStats.favoriteObjects = 0
        }

        setStats(newStats)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [user])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Cards communes (particuliers + pros)
  const commonCards = [
    {
      title: "Objets en vente",
      value: stats.activeObjects.toString(),
      description: "Actuellement actifs",
      icon: Package,
    },
    {
      title: "Ventes terminées",
      value: stats.soldObjects.toString(),
      description: `Total: ${stats.totalRevenue.toLocaleString('fr-FR')}€`,
      icon: TrendingUp,
    },
    {
      title: "Revenus générés",
      value: `${stats.totalRevenue.toLocaleString('fr-FR')}€`,
      description: `En attente: ${stats.pendingRevenue.toLocaleString('fr-FR')}€`,
      icon: DollarSign,
    },
  ]

  // Cards spécifiques aux professionnels
  const proCards = [
    {
      title: "Enchères actives",
      value: stats.activeBids.toString(),
      description: "Enchères en cours",
      icon: TrendingUp,
    },
    {
      title: "Enchères gagnées",
      value: stats.wonAuctions.toString(),
      description: "Total remporté",
      icon: Package,
    },
    {
      title: "Objets favoris",
      value: stats.favoriteObjects.toString(),
      description: "Dans votre liste",
      icon: DollarSign,
    },
  ]

  const statsCards = isPro ? [...commonCards, ...proCards] : commonCards

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bonjour, {user?.firstName || user?.email} 👋
        </h1>
        <p className="text-muted-foreground">
          {isPro
            ? "Tableau de bord Professionnel - Gérez vos achats et ventes"
            : "Tableau de bord Particulier - Gérez vos ventes"
          }
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
