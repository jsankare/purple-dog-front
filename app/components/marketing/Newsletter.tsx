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
    <div className="card">
      <h3 className="h3">Inscrivez-vous à la newsletter</h3>
      <p className="mt-2 text-muted">Recevez nos actualités et sélections d’objets.</p>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email"
          className="input w-full"
        />
        <button type="submit" className="btn btn-primary">
          S’inscrire
        </button>
      </form>
      {ok && <div className="mt-3 text-sm" style={{ color: "#166534" }}>{ok}</div>}
    </div>
  );
}