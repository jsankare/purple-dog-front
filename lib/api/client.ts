// lib/api/client.ts
const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const BASE = RAW_BASE.replace(/\/$/, "");

async function request(path: string, init?: RequestInit) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    let msg = `HTTP \${res.status}`;
    try {
      const j = await res.json();
      if (j?.errors?.[0]?.message) msg = j.errors[0].message;
      else if (j?.message) msg = j.message;
      else if (j?.error) msg = j.error;
    } catch {}
    throw new Error(msg);
  }

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export const apiClient = {
  get: (p: string) => request(p),
  post: (p: string, body: any) => request(p, { method: "POST", body: JSON.stringify(body) }),
  postForm: (p: string, form: FormData) => request(p, { method: "POST", body: form }),
};