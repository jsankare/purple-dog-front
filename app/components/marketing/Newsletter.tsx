"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState<null | string>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: call API ici plus tard
    setOk("Merci, vous êtes inscrit(e) !");
    setEmail("");
  }

  return (
    <div className="rounded-lg border bg-white p-6">
      <h3 className="text-xl font-semibold">Inscrivez-vous à la newsletter</h3>
      <p className="mt-2 text-gray-600">Recevez nos actualités et sélections d’objets.</p>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email"
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
        />
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          S’inscrire
        </button>
      </form>
      {ok && <div className="mt-3 text-sm text-green-600">{ok}</div>}
    </div>
  );
}