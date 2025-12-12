import { MyPurchasesTable } from '@/components/dashboard/MyPurchasesTable'

export const metadata = {
  title: 'Mes Achats - Purple Dog',
  description: 'Consultez vos achats et leur statut de livraison',
}

export default function MesAchatsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mes Achats</h1>
        <p className="text-muted-foreground">
          Consultez vos achats, leur statut de paiement et de livraison
        </p>
      </div>

      <MyPurchasesTable />
    </div>
  )
}
