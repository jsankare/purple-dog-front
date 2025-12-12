'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ArrowLeft, Upload, X, ImageIcon, Info } from 'lucide-react'
import { categoriesAPI, objectsAPI, mediaAPI, globalsAPI } from '@/lib/api'
import { toast } from "sonner"

const commonSchema = {
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  category: z.string().min(1, 'Veuillez sélectionner une catégorie'),
  dimensions: z.object({
    height: z.any().transform((val, ctx) => {
      const n = Number(val)
      if (isNaN(n) || n <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Requis (> 0)' })
        return z.NEVER
      }
      return n
    }),
    width: z.any().transform((val, ctx) => {
      const n = Number(val)
      if (isNaN(n) || n <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Requis (> 0)' })
        return z.NEVER
      }
      return n
    }),
    depth: z.any().transform((val, ctx) => {
      const n = Number(val)
      if (isNaN(n) || n <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Requis (> 0)' })
        return z.NEVER
      }
      return n
    }),
    weight: z.any().transform((val, ctx) => {
      const n = Number(val)
      if (isNaN(n) || n <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Requis (> 0)' })
        return z.NEVER
      }
      return n
    }),
  }),
  photos: z.any()
    .transform((val) => Array.isArray(val) ? val : [])
    .pipe(z.array(z.any()).min(10, 'Minimum 10 photos requises')),
}

const quickSaleSchema = z.object({
  ...commonSchema,
  saleMode: z.literal('quick_sale'),
  quickSalePrice: z.any()
    .transform((val) => {
      const n = Number(val)
      return (val === '' || val === null || val === undefined || isNaN(n)) ? undefined : n
    })
    .refine((val) => val !== undefined, { message: 'Le prix doit être renseigné' })
    .pipe(z.number().positive('Le prix doit être supérieur à 0')),
  auctionStartPrice: z.any().optional(),
  auctionEndDate: z.any().optional(),
})

const auctionSchema = z.object({
  ...commonSchema,
  saleMode: z.literal('auction'),
  auctionStartPrice: z.any()
    .transform((val) => {
      const n = Number(val)
      return (val === '' || val === null || val === undefined || isNaN(n)) ? undefined : n
    })
    .refine((val) => val !== undefined, { message: 'Le prix doit être renseigné' })
    .pipe(z.number().positive('Le prix doit être supérieur à 0')),
  auctionEndDate: z.string().optional(),
  quickSalePrice: z.any().optional(),
})

const objectSchema = z.discriminatedUnion('saleMode', [quickSaleSchema, auctionSchema])

type ObjectFormData = z.infer<typeof objectSchema>

export default function VendrePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [defaultDuration, setDefaultDuration] = useState(7)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ObjectFormData>({
    resolver: zodResolver(objectSchema),
    defaultValues: {
      saleMode: 'quick_sale',
      category: '',
      dimensions: {
        height: 0,
        width: 0,
        depth: 0,
        weight: 0,
      },
      photos: [],
    },
  })

  const saleMode = watch('saleMode')
  const auctionEndDate = watch('auctionEndDate')

  // Fetch categories AND settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsResult, settingsResult] = await Promise.all([
          categoriesAPI.getAll({ limit: 100 }),
          globalsAPI.getSettings()
        ])
        
        console.log('Categories loaded:', catsResult.docs)
        setCategories(catsResult.docs || [])
        
        if (settingsResult?.defaultAuctionDuration) {
          setDefaultDuration(settingsResult.defaultAuctionDuration)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
      }
    }
    fetchData()
  }, [])

  // Auto-set date when switching to auction mode if empty
  useEffect(() => {
    if (saleMode === 'auction' && !auctionEndDate) {
      const date = new Date()
      date.setDate(date.getDate() + defaultDuration)
      const dateString = date.toISOString().slice(0, 16)
      setValue('auctionEndDate', dateString)
    }
  }, [saleMode, defaultDuration, setValue]) // Only run when these change, intentionally omitting auctionEndDate from deps to run only on mode switch

  // Handle photo selection (click)
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    processFiles(files)
  }

  // Remove a photo
  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const newPhotos = prev.filter((_, i) => i !== index)
      setValue('photos', newPhotos, { shouldValidate: true })
      return newPhotos
    })
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Handle file processing (shared between click and drop)
  const processFiles = (files: File[]) => {
    if (files.length + photos.length > 20) {
      setError('Maximum 20 photos autorisées')
      return
    }
    
    setPhotos(prev => {
      const newPhotos = [...prev, ...files]
      setValue('photos', newPhotos, { shouldValidate: true })
      return newPhotos
    })
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    processFiles(files)
  }

  // Handle form errors
  const onError = (errors: any) => {
    console.error('Form Validation Errors:', errors)
    toast.error("Veuillez corriger les erreurs dans le formulaire")
  }

  const onSubmit = async (data: ObjectFormData) => {
    console.log('Submitting form data:', data)

    setIsLoading(true)
    setError(null)

    try {
      // 1. Upload photos first
      const uploadedPhotoIds: string[] = []
      
      for (const photo of photos) {
        try {
          const uploadResult = await mediaAPI.upload(photo)
          if (uploadResult?.doc?.id) {
            uploadedPhotoIds.push(uploadResult.doc.id)
          }
        } catch (uploadErr) {
          console.error('Error uploading photo:', uploadErr)
          toast.error(`Erreur lors de l'upload de ${photo.name}`)
        }
      }

      if (uploadedPhotoIds.length === 0) {
        throw new Error("Aucune photo n'a pu être uploadée")
      }

      // Calculate default end date if missing
      let finalEndDate = data.auctionEndDate
      if (data.saleMode === 'auction' && !finalEndDate) {
        const date = new Date()
        date.setDate(date.getDate() + defaultDuration)
        finalEndDate = date.toISOString()
      }

      // 2. Create object with photo IDs
      const objectData = {
        name: data.name,
        description: data.description,
        category: data.category,
        saleMode: data.saleMode,
        status: 'active',
        dimensions: data.dimensions,
        ...(data.saleMode === 'quick_sale' && { quickSalePrice: data.quickSalePrice }),
        ...(data.saleMode === 'auction' && { 
          auctionStartPrice: data.auctionStartPrice,
          auctionEndDate: finalEndDate 
        }),
        // Photos array format expected by Payload
        photos: uploadedPhotoIds.map((id, index) => ({
          name: `Photo ${index + 1}`,
          image: id,
        })),
      }

      await objectsAPI.create(objectData)
      toast.success("Objet mis en vente avec succès !")
      
      router.push('/dashboard/mes-objets')
    } catch (err: any) {
      console.error('Error creating object:', err)
      const message = err.message || 'Une erreur est survenue lors de la création de l\'objet'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/mes-objets">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendre un objet</h1>
          <p className="text-muted-foreground">
            Remplissez les informations ci-dessous pour mettre en vente votre bien.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Card>
          <CardHeader>
            <CardTitle>Détails de l'objet</CardTitle>
            <CardDescription>
              Décrivez précisément votre objet pour attirer les acheteurs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'objet *</Label>
              <Input
                id="name"
                placeholder="Ex: Montre Rolex Submariner 1990"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={(val) => field.onChange(String(val))} 
                    value={field.value ? String(field.value) : undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            {/* Sale Mode */}
            <div className="space-y-3">
              <Label>Mode de vente *</Label>
              <RadioGroup
                value={saleMode}
                onValueChange={(value) => setValue('saleMode', value as 'auction' | 'quick_sale')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quick_sale" id="quick_sale" />
                  <Label htmlFor="quick_sale" className="font-normal cursor-pointer">
                    ⚡ Vente rapide (prix fixe)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="auction" id="auction" />
                  <Label htmlFor="auction" className="font-normal cursor-pointer">
                    🔨 Enchère
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Quick Sale Price */}
            {saleMode === 'quick_sale' && (
              <div className="space-y-2">
                <Label htmlFor="quickSalePrice">Prix de vente (€) *</Label>
                <Input
                  id="quickSalePrice"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 50.00"
                  {...register('quickSalePrice')}
                />
                {/* @ts-ignore - Union type complexity */}
                {errors.quickSalePrice && (
                  <p className="text-sm text-destructive">{errors.quickSalePrice.message as string}</p>
                )}
              </div>
            )}

            {/* Auction Fields */}
            {saleMode === 'auction' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="auctionStartPrice">Prix de départ (€) *</Label>
                  <Input
                    id="auctionStartPrice"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 20.00"
                    {...register('auctionStartPrice')}
                  />
                  {/* @ts-ignore - Union type complexity */}
                  {errors.auctionStartPrice && (
                    <p className="text-sm text-destructive">{errors.auctionStartPrice.message as string}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="auctionEndDate">Date de fin</Label>
                    <div className="group relative flex items-center">
                      <Info className="h-4 w-4 text-primary cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-2 bg-slate-900 text-white text-xs rounded shadow-lg z-50 text-center">
                        Une date de {defaultDuration} jours à partir de maintenant sera définie par défaut, mais vous pouvez la modifier.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                      </div>
                    </div>
                  </div>
                  <Input
                    id="auctionEndDate"
                    type="datetime-local"
                    {...register('auctionEndDate')}
                  />
                  {/* @ts-ignore - Union type complexity */}
                  {errors.auctionEndDate && (
                    <p className="text-sm text-destructive">{errors.auctionEndDate.message as string}</p>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="État, provenance, détails spécifiques..."
                className="min-h-[120px]"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            {/* Photos */}
            <div className="space-y-3">
              <Label>Photos (minimum : 10 photos)</Label>
              {errors.photos && <p className="text-sm text-destructive">{errors.photos.message}</p>}
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  isDragging ? 'border-primary bg-primary/5' : 'hover:border-primary'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >  <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Glissez-déposez vos photos ou{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-primary hover:underline"
                    >
                      parcourez
                    </button>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {photos.length}/20 photos ajoutées (min. 10)
                  </p>
                </div>
              </div>
              
              {/* Photo previews */}
              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={preview}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dimensions */}
            <div className="space-y-3">
              <Label>Dimensions (cm) et Poids (kg) *</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-xs">Hauteur</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    {...register('dimensions.height', { valueAsNumber: true })}
                  />
                  {errors.dimensions?.height && <p className="text-xs text-destructive">{errors.dimensions.height.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width" className="text-xs">Largeur</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    {...register('dimensions.width', { valueAsNumber: true })}
                  />
                  {errors.dimensions?.width && <p className="text-xs text-destructive">{errors.dimensions.width.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depth" className="text-xs">Profondeur</Label>
                  <Input
                    id="depth"
                    type="number"
                    step="0.1"
                    {...register('dimensions.depth', { valueAsNumber: true })}
                  />
                  {errors.dimensions?.depth && <p className="text-xs text-destructive">{errors.dimensions.depth.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-xs">Poids</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    {...register('dimensions.weight', { valueAsNumber: true })}
                  />
                  {errors.dimensions?.weight && <p className="text-xs text-destructive">{errors.dimensions.weight.message}</p>}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/mes-objets">Annuler</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saleMode === 'auction' ? "Publier l'enchère" : "Publier la vente"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
