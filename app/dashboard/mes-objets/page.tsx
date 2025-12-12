'use client'

import { useState, useEffect } from 'react'
import { ObjectCard } from '@/components/objects'
import { objectsAPI } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'

export default function MesObjetsPage() {
  const { user } = useAuth()
  const [objects, setObjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('active')

  useEffect(() => {
    const fetchMyObjects = async () => {
      if (!user) return
      
      setIsLoading(true)
      try {
        // Fetch all objects and filter by current user
        const result = await objectsAPI.getAll({
          limit: 100,
        })
        
        // Filter objects where seller is current user
        const myObjects = (result.docs || []).filter((obj: any) => {
          const sellerId = typeof obj.seller === 'string' ? obj.seller : obj.seller?.id
          return sellerId === user.id
        })
        
        setObjects(myObjects)
      } catch (error) {
        console.error('Error fetching my objects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMyObjects()
  }, [user])

  const filterObjectsByStatus = (status: string) => {
    return objects.filter(obj => obj.status === status)
  }

  const activeObjects = filterObjectsByStatus('active')
  const soldObjects = filterObjectsByStatus('sold')
  const expiredObjects = filterObjectsByStatus('expired')

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
        <h1 className="text-3xl font-bold tracking-tight">Mes objets</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos objets en vente
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">
            En vente ({activeObjects.length})
          </TabsTrigger>
          <TabsTrigger value="sold">
            Vendus ({soldObjects.length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expirés ({expiredObjects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeObjects.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">
                Vous n'avez aucun objet en vente actuellement.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeObjects.map((object) => (
                <ObjectCard key={object.id} object={object} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sold" className="mt-6">
          {soldObjects.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">
                Aucun objet vendu pour le moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {soldObjects.map((object) => (
                <ObjectCard key={object.id} object={object} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="expired" className="mt-6">
          {expiredObjects.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">
                Aucun objet expiré.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {expiredObjects.map((object) => (
                <ObjectCard key={object.id} object={object} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
