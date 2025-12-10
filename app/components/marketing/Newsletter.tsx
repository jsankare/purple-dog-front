"use client";
import { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // TODO: Remplacer par vrai appel API
      // const response = await fetch('/api/newsletter', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      setSuccess(true);
      setEmail("");

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#4B2377] text-white p-8 lg:p-16">
      <div className="max-w-3xl mx-auto text-center">
        <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8" />
        </div>

        <h2 className="text-3xl lg:text-4xl font-serif mb-4">
          Restez informé
        </h2>
        <p className="text-lg text-purple-100 mb-8 leading-relaxed">
          Inscrivez-vous à notre newsletter et recevez en exclusivité les dernières enchères,
          actualités du marché et conseils d'experts
        </p>

        {success ? (
          <div className="bg-white/10 border border-white/30 p-6 rounded inline-flex items-center gap-3 mx-auto">
            <CheckCircle className="w-6 h-6 text-white" />
            <span className="text-white font-medium">
              Merci ! Votre inscription a été confirmée.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                required
                className="flex-1 px-6 py-4 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-white text-[#4B2377] hover:bg-neutral-100 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#4B2377] border-t-transparent rounded-full animate-spin"></div>
                    <span>Envoi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>S'inscrire</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-200">
                {error}
              </p>
            )}

            <p className="mt-4 text-sm text-purple-200">
              En vous inscrivant, vous acceptez de recevoir nos emails marketing.
              Désinscription possible à tout moment.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
