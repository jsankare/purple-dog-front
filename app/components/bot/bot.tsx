"use client";

import React, { useEffect, useRef, useState } from "react";

export default function Bot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    if (open) {
      messagesRef.current?.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [open]);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const contentType = res.headers.get("content-type");

      if (
        contentType &&
        contentType.includes("application/json") &&
        res.status !== 200
      ) {
        const data = await res.json();

        if (data.error) {
          setResponse(
            `Purple Dog Bot est parti en promenade. Il devrait bientôt revenir, réessayez un peu plus tard !`,
          );
          setLoading(false);
          return;
        }
      }

      if (!res.ok) {
        setResponse(`Error: ${res.statusText}`);
        setLoading(false);
        return;
      }

      if (!res.body) {
        setResponse("No response body");
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let partial = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        partial += decoder.decode(value, { stream: true });

        let boundary;
        while ((boundary = partial.indexOf("\n")) !== -1) {
          const chunk = partial.substring(0, boundary);
          partial = partial.substring(boundary + 1);

          if (chunk.trim()) {
            try {
              const parsed = JSON.parse(chunk);
              if (parsed.response) {
                setResponse((prev) => prev + parsed.response);
              }
              if (parsed.done && parsed.done === true) {
                break;
              }
            } catch (e) {
              console.error("Error parsing JSON chunk:", e);
            }
          }
        }
      }
    } catch (err) {
      setResponse(
        "Purple Dog Bot est parti en promenade. Il devrait bientôt revenir, réessayez un peu plus tard !",
      );
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  return (
    <div
      className={`fixed bottom-6 left-15 z-50 ${
        fullScreen
          ? "inset-0 m-0 h-full w-full px-4 py-6 md:px-10 md:py-8"
          : "w-80 md:w-96"
      }`}
    >
      {!open ? (
        <button
          aria-label="Ouvrir le chat"
          onClick={() => setOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-subtle shadow-md transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--ring)]"
          style={{ background: "var(--brand)", color: "#fff" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      ) : (
        <div
          className="flex h-full w-full flex-col overflow-hidden rounded-app border-subtle shadow-lg"
          style={{ background: "var(--surface)" }}
        >
          <div
            className="flex items-center justify-between gap-3 border-b border-subtle px-4 py-3"
            style={{ background: "var(--surface-2)" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold"
                style={{ background: "var(--brand)", color: "#fff" }}
              >
                PD
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold">Purple Dog Bot</div>
                <div className="text-xs text-muted">
                  Disponible pour vos questions
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReduced(!reduced)}
                className="btn btn-neutral h-9 w-9"
                style={{ padding: 0 }}
                aria-label={reduced ? "Déplier le chat" : "Réduire le chat"}
              >
                {reduced ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setFullScreen(!fullScreen)}
                className="btn btn-neutral h-9 w-9"
                style={{ padding: 0 }}
                aria-label={
                  fullScreen
                    ? "Quitter le plein écran"
                    : "Passer en plein écran"
                }
              >
                {fullScreen ? (
                  <svg
                    width="84px"
                    height="84px"
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <polyline points="52 40 40 40 40 52"></polyline>
                      <line x1="40" y1="40" x2="56" y2="56"></line>
                      <polyline points="24 52 24 40 12 40"></polyline>
                      <line x1="24" y1="40" x2="8" y2="56"></line>
                      <polyline points="12 24 24 24 24 12"></polyline>
                      <line x1="24" y1="24" x2="8" y2="8"></line>
                      <polyline points="40 12 40 24 52 24"></polyline>
                      <line x1="40" y1="24" x2="56" y2="8"></line>
                    </g>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4h4m12 4V4h-4M4 16v4h4m12-4v4h-4"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setResponse("");
                }}
                className="btn btn-neutral h-9 w-9"
                style={{ padding: 0 }}
                aria-label="Fermer le chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {!reduced && (
            <>
              <div
                ref={messagesRef}
                className="flex-1 overflow-auto border-b border-subtle px-4 py-3"
                style={{ background: "var(--surface)" }}
              >
                {response ? (
                  <pre
                    className="whitespace-pre-wrap text-sm leading-relaxed"
                    style={{ color: "var(--text)" }}
                  >
                    {response}
                  </pre>
                ) : (
                  <div className="text-sm text-muted">
                    Posez une question au bot Purple Dog.
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-3 px-4 py-3"
                style={{ background: "var(--surface)" }}
              >
                <textarea
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="input w-full resize-none text-sm"
                  style={{ minHeight: "88px" }}
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary h-10 px-4"
                    >
                      {loading ? "Envoi..." : "Soumettre"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInput("");
                      }}
                      className="btn btn-neutral h-10 px-4"
                    >
                      Effacer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInput("");
                        setResponse("");
                      }}
                      className="btn btn-outline h-10 px-4"
                    >
                      Nouveau chat
                    </button>
                    {response && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(response);
                          setCopied(true);
                        }}
                        className="btn btn-neutral h-10 px-4"
                      >
                        Copier
                      </button>
                    )}
                  </div>
                  {copied && (
                    <span className="text-sm text-muted">Copié !</span>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
