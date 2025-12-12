'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { mediaAPI } from '@/lib/api'
import { getErrorMessage } from '@/lib/error-mapping'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Loader2, AlertCircle, Building2, User } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('particulier')

  // État initial commun
  const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      postalCode: '',
      city: '',
      country: 'France'
    },
    // Spécifique Pro
    companyName: '',
    siret: '',
    website: '',
    // Checkboxes
    isOver18: false,
    acceptedTerms: false,
    acceptedGDPR: false,
    acceptedMandate: false, // Pro only
    newsletterSubscription: false
  }

  const [formData, setFormData] = useState(initialFormState)
  const [officialDocument, setOfficialDocument] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    if (id.startsWith('address.')) {
      const field = id.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [id]: value }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setOfficialDocument(e.target.files[0])
    }
  }

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [id]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // ... validation checks

    setIsLoading(true)

    try {
      let documentId = null

      // ÉTAPE 1: Upload (Pro)
      if (activeTab === 'professionnel' && officialDocument) {
        try {
          const uploadResult = await mediaAPI.upload(officialDocument)
          documentId = uploadResult.doc.id
        } catch (uploadError: any) {
           // On transforme l'erreur d'upload aussi
           throw new Error(getErrorMessage(uploadError))
        }
      }

      // ÉTAPE 2: Inscription
      const role = activeTab === 'professionnel' ? 'professionnel' : 'particulier'
      
      const payload = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: role,
        address: formData.address,
        newsletterSubscription: formData.newsletterSubscription,
        acceptedTerms: formData.acceptedTerms,
        acceptedGDPR: formData.acceptedGDPR,
        isOver18: formData.isOver18,
        ...(activeTab === 'professionnel' && {
           companyName: formData.companyName,
           siret: formData.siret,
           website: formData.website,
           acceptedMandate: formData.acceptedMandate,
           officialDocument: documentId
        })
      }

      await register(payload)
      // REDIRECTION CHANGÉE : Vers la page de confirmation d'envoi d'email
      router.push('/verify-email-sent')
      
    } catch (err: any) {
      console.error(err)
      // Utilisation du mapping d'erreur
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Créer un compte</CardTitle>
          <CardDescription>
             Choisissez votre profil pour commencer
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="particulier" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 mb-6">
            <TabsList className="grid w-full grid-cols-2 h-auto p-1">
              <TabsTrigger 
                value="particulier" 
                className="py-3 flex items-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white dark:data-[state=active]:bg-indigo-600 dark:data-[state=active]:text-white"
              >
                <User className="h-4 w-4" /> Particulier
              </TabsTrigger>
              <TabsTrigger 
                value="professionnel" 
                className="py-3 flex items-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white dark:data-[state=active]:bg-indigo-600 dark:data-[state=active]:text-white"
              >
                 <Building2 className="h-4 w-4" /> Professionnel
              </TabsTrigger>
            </TabsList>
          </div>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* SECTION: Identité Commune */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Identité</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input id="firstName" value={formData.firstName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input id="lastName" value={formData.lastName} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              <Separator />

              {/* SECTION: Spécifique Professionnel */}
              <TabsContent value="professionnel" className="space-y-4 mt-0">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Informations Société</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Raison Sociale *</Label>
                    <Input id="companyName" value={formData.companyName} onChange={handleChange} required={activeTab === 'professionnel'} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siret">Numéro SIRET *</Label>
                    <Input id="siret" value={formData.siret} onChange={handleChange} required={activeTab === 'professionnel'} placeholder="14 chiffres" maxLength={14} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Site Internet</Label>
                  <Input id="website" value={formData.website} onChange={handleChange} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="officialDocument">Document Officiel (K-Bis) *</Label>
                   <Input 
                     id="officialDocument" 
                     type="file" 
                     accept=".pdf,.jpg,.jpeg,.png"
                     onChange={handleFileChange}
                     required={activeTab === 'professionnel'} 
                     className="cursor-pointer"
                   />
                   <p className="text-xs text-muted-foreground">Formats acceptés : PDF, JPG, PNG.</p>
                </div>
              </TabsContent>

              {/* SECTION: Adresse Commune */}
              <div className="space-y-4">
                 <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Adresse Postale</h3>
                 <div className="space-y-2">
                    <Label htmlFor="address.street">Rue *</Label>
                    <Input id="address.street" value={formData.address.street} onChange={handleChange} required />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address.postalCode">Code Postal *</Label>
                      <Input id="address.postalCode" value={formData.address.postalCode} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address.city">Ville *</Label>
                      <Input id="address.city" value={formData.address.city} onChange={handleChange} required />
                    </div>
                 </div>
              </div>

              <Separator />

              {/* SECTION: Sécurité Commune */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sécurité</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe *</Label>
                    <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer *</Label>
                    <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {/* SECTION: Consentement */}
              <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                 {/* Particulier : Majeur */}
                 <TabsContent value="particulier" className="mt-0">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="isOver18" 
                        checked={formData.isOver18}
                        onCheckedChange={(c) => handleCheckboxChange('isOver18', c as boolean)}
                      />
                      <Label htmlFor="isOver18">Je certifie avoir plus de 18 ans *</Label>
                    </div>
                 </TabsContent>

                 {/* Commun : CGU */}
                 <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceptedTerms"
                      checked={formData.acceptedTerms}
                      onCheckedChange={(c) => handleCheckboxChange('acceptedTerms', c as boolean)}
                    />
                    <Label htmlFor="acceptedTerms">
                      J'accepte les <Link href="/cgu" className="text-indigo-600 hover:underline">Conditions Générales d'Utilisation</Link> *
                    </Label>
                 </div>

                 {/* Commun : RGPD/GDPR */}
                 <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceptedGDPR"
                      checked={formData.acceptedGDPR}
                      onCheckedChange={(c) => handleCheckboxChange('acceptedGDPR', c as boolean)}
                    />
                    <Label htmlFor="acceptedGDPR">
                      J'accepte la <Link href="/confidentialite" className="text-indigo-600 hover:underline">Politique de confidentialité</Link> et le traitement de mes données personnelles *
                    </Label>
                 </div>

                 {/* Pro : Mandat */}
                 <TabsContent value="professionnel" className="mt-0 pt-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="acceptedMandate" 
                        checked={formData.acceptedMandate}
                        onCheckedChange={(c) => handleCheckboxChange('acceptedMandate', c as boolean)}
                      />
                      <Label htmlFor="acceptedMandate" className="leading-snug">
                        J'accepte le mandat d'apport d'affaire et certifie l'exactitude des informations professionnelles fournies *
                      </Label>
                    </div>
                 </TabsContent>
                 
                 {/* Newsletter */}
                 <div className="flex items-center space-x-2 pt-2">
                    <Checkbox 
                      id="newsletterSubscription" 
                      checked={formData.newsletterSubscription}
                      onCheckedChange={(c) => handleCheckboxChange('newsletterSubscription', c as boolean)}
                    />
                    <Label htmlFor="newsletterSubscription">Je souhaite recevoir la newsletter Purple Dog</Label>
                 </div>
              </div>

            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {activeTab === 'professionnel' ? "S'inscrire comme Professionnel" : "S'inscrire comme Particulier"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Déjà un compte ?{' '}
                <Link href="/login" className="text-indigo-600 hover:underline">
                  Se connecter
                </Link>
              </div>
            </CardFooter>
          </form>
        </Tabs>
      </Card>
    </div>
  )
}
