"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState<null | string>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOk("Merci, vous êtes inscrit(e) !");
    setEmail("");
  }

  return (
    <div className="rounded-app border-subtle surface-2 p-8 md:p-12 space-y-6">
      <div className="space-y-2">
        <h3 className="h3">Restez informé des nos enchères</h3>
        <p className="text-muted max-w-2xl">
          Recevez chaque semaine notre sélection d'objets rares, les actualités du marché 
          et les conseils de nos experts. Soyez parmi les premiers à découvrir nos nouvelles enchères.
        </p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="input flex-1"
        />
        <button type="submit" className="btn btn-primary shrink-0">
          S'inscrire
        </button>
      </form>
      {ok && (
        <div className="text-sm p-3 rounded-app" style={{ background: "rgba(22, 101, 52, 0.1)", color: "var(--brand)" }}>
          ✓ {ok}
        </div>
      )}
      <p className="text-xs text-muted">
        Nous respectons votre vie privée. Désinscription en un clic.
      </p>
    </div>
  );
}