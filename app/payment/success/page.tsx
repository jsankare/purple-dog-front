"use client";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <main className="min-h-screen bg-[#F9F3FF] flex items-center justify-center">
      <div className="mx-auto w-full max-w-md px-4 py-10 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-600">Paiement réussi !</h1>
        <p className="mb-8 text-neutral-700">Merci pour votre achat. Votre paiement a bien été pris en compte.</p>
        {/* Session Stripe masquée */}
        <Link href="/objets">
          <button className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 px-6 rounded-lg transition-all">
            Retour à la liste des objets
          </button>
        </Link>
      </div>
    </main>
  );
}
