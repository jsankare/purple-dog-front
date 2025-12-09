"use client";

import React, { useEffect, useRef, useState } from "react";

export default function Bot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      // Scroll to bottom when opened or when response updates
      messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [open, response]);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gemma3:1b", prompt: input }),
      });

      if (!res.ok) {
        setResponse(`Error: ${res.statusText}`);
        setLoading(false);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulated = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          accumulated += decoder.decode(value, { stream: true });

          // Extract "response" fields from streaming chunks (best-effort)
          const matches = accumulated.match(/"response":"(.*?)","done":(true|false)/g);
          if (matches) {
            const latest = matches[matches.length - 1];
            const respMatch = latest.match(/"response":"(.*?)","done":(true|false)/);
            if (respMatch) {
              const text = respMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
              setResponse((prev) => prev + text);
            }
          }
        }
      }
    } catch {
      setResponse("Fetch error");
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open ? (
        <button
          aria-label="Ouvrir le chat"
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary-dark focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 1.657-1.343 3-3 3H6l-4 4V5a2 2 0 012-2h14c1.657 0 3 1.343 3 3v6z" />
          </svg>
        </button>
      ) : (
        <div className="w-80 md:w-96 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border">
          <div className="flex items-center justify-between px-3 py-2 bg-primary text-white">
            <div className="flex items-center gap-2">
              <span className="font-medium">Purple Dog Bot</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setOpen(false);
                  // keep response if you want; here we keep it but could clear
                }}
                className="text-white/90 hover:text-white/100 text-sm focus:outline-none"
              >
                Fermer
              </button>
            </div>
          </div>

          <div ref={messagesRef} className="p-3 flex-1 overflow-auto min-h-[120px] max-h-64 bg-gray-50">
            {response ? (
              <pre className="whitespace-pre-wrap text-sm text-gray-800">{response}</pre>
            ) : (
              <div className="text-sm text-gray-500">Posez une question au bot Purple Dog.</div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t bg-white">
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrivez votre message..."
              className="w-full p-2 border rounded resize-none text-sm"
            />

            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-1 bg-primary text-white rounded disabled:opacity-60"
                >
                  {loading ? "Envoi..." : "Envoyer"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInput("");
                    setResponse("");
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded"
                >
                  Effacer
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
