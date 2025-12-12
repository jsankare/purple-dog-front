'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) {
    return <div className="p-8 text-center">Chargement du profil...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et vos préférences de sécurité.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Info Rapide */}
        <Card className="w-full md:w-1/3 h-fit">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="/avatars/01.png" />
              <AvatarFallback className="text-2xl">{user.firstName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle>{user.firstName} {user.lastName}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm mt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Membre depuis</span>
                <span className="font-medium">Juin 2024</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Objets vendus</span>
                <span className="font-medium">12</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Note vendeur</span>
                <span className="font-medium text-green-600">4.8/5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Contenu */}
        <div className="flex-1">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Informations Générales</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
            </TabsList>
            
            {/* Onglet Général */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Détails du compte</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations publiques.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" defaultValue={user.firstName} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" defaultValue={user.lastName} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue={user.email} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Input id="bio" placeholder="Dites-nous en plus sur vous..." />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">Sauvegarder les modifications</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Onglet Sécurité */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Mot de passe</CardTitle>
                  <CardDescription>
                    Changez votre mot de passe pour sécuriser votre compte.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current">Mot de passe actuel</Label>
                    <Input id="current" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new">Nouveau mot de passe</Label>
                    <Input id="new" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirmer le nouveau mot de passe</Label>
                    <Input id="confirm" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Mettre à jour le mot de passe</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
