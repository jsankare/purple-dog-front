"use client";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { transactionsAPI } from '@/lib/api';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Vérification du paiement...');

  useEffect(() => {
    if (sessionId) {
      const confirmPayment = async () => {
        try {
          await transactionsAPI.confirmPayment(sessionId);
          setStatus('success');
          setMessage('Merci pour votre achat. Votre paiement a bien été pris en compte et validé.');
        } catch (error) {
          console.error('Erreur confirmation paiement:', error);
          setStatus('error');
          setMessage('Le paiement a peut-être réussi mais nous n\'avons pas pu le confirmer automatiquement. Veuillez vérifier vos achats.');
        }
      };
      confirmPayment();
    } else {
      setStatus('success'); // Fallback si pas de session_id (accès direct)
      setMessage('Merci pour votre achat.');
    }
  }, [sessionId]);

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 bg-white rounded-xl shadow-lg text-center">
      {status === 'loading' && (
        <>
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-4 text-neutral-800">Vérification en cours...</h1>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-green-600">Paiement réussi !</h1>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-orange-600">Attention</h1>
        </>
      )}

      <p className="mb-8 text-neutral-700">{message}</p>

      <div className="flex flex-col gap-3">
        <Link href="/objets" className="w-full">
          <button className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 px-6 rounded-lg transition-all">
            Retour à la liste des objets
          </button>
        </Link>
        <Link href="/dashboard/particulier" className="w-full">
          <button className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold py-3 px-6 rounded-lg transition-all">
            Voir mes achats
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <main className="min-h-screen bg-[#F9F3FF] flex items-center justify-center">
      <Suspense fallback={<div className="text-center">Chargement...</div>}>
         <PaymentSuccessContent />
      </Suspense>
    </main>
  );
}
