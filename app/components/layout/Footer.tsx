import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-subtle surface">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <div className="text-sm text-muted">
            © {new Date().getFullYear()} Purple Dog
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/mentions-legales" className="link">Mentions Légales</Link>
            <Link href="/qui-sommes-nous" className="link">Qui Sommes-Nous ?</Link>
            <Link href="/contact" className="btn btn-outline h-9">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}