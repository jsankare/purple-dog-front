import { MyBidsTable } from '@/components/dashboard/MyBidsTable'

export const metadata = {
  title: 'Mes Enchères - Purple Dog',
  description: 'Suivez vos enchères en cours, gagnées et perdues',
}

export default function MesEncheresPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mes Enchères</h1>
        <p className="text-muted-foreground">
          Suivez toutes vos enchères en cours et consultez votre historique
        </p>
      </div>

      <MyBidsTable />
    </div>
  )
}
