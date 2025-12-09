import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-gray-500">© {new Date().getFullYear()} Purple Dog</div>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/mentions-legales" className="hover:underline">
              Mentions Légales
            </Link>
            <Link href="/qui-sommes-nous" className="hover:underline">
              Qui Sommes-Nous ?
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}