"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { User, LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import logo from "@/public/purple-dog-nobg.webp";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string|null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
      authAPI.me().then((res) => {
        setUserRole(res?.user?.role || null);
      }).catch(() => setUserRole(null));
    } else {
      setUserRole(null);
    }

    const handleAuthChange = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
      if (token) {
        authAPI.me().then((res) => {
          setUserRole(res?.user?.role || null);
        }).catch(() => setUserRole(null));
      } else {
        setUserRole(null);
      }
    };

    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setIsLoggedIn(false);
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      router.push('/');
    }
  };

  return (
    <header className="w-full bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" aria-label="Accueil Purple Dog">
            <div className="flex items-center gap-2">
                <Image width={100} src={logo} alt={"Logo purple dog"} />
              <span className="text-2xl font-serif text-neutral-900 group-hover:text-[#4B2377] transition-colors">
                Purple Dog
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
                        <button
                          className="text-sm text-neutral-600 hover:text-[#4B2377] transition-colors font-medium px-4 py-2 border border-neutral-200 rounded"
                          onClick={() => {
                            if (!isLoggedIn) {
                              router.push('/login');
                            } else if (userRole === 'particulier') {
                              router.push('/dashboard/particulier');
                            } else if (userRole === 'professionnel') {
                              router.push('/dashboard/professionnel');
                            } else {
                              router.push('/profile');
                            }
                          }}
                        >
                          Dashboard
                        </button>
            <Link 
              href="/objets" 
              className="text-sm text-neutral-600 hover:text-[#4B2377] transition-colors font-medium"
            >
              Objets
            </Link>
            <Link 
              href="/encheres" 
              className="text-sm text-neutral-600 hover:text-[#4B2377] transition-colors font-medium"
            >
              Enchères
            </Link>
            <Link 
              href="/vendre" 
              className="text-sm text-neutral-600 hover:text-[#4B2377] transition-colors font-medium"
            >
              Vendre
            </Link>
            <Link 
              href="/comment-ca-marche" 
              className="text-sm text-neutral-600 hover:text-[#4B2377] transition-colors font-medium"
            >
              Comment ça marche
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-neutral-200">
                <Link 
                  href="/feedback" 
                  className="text-sm text-neutral-600 hover:text-[#4B2377] transition-colors font-medium"
                >
                  Donner un avis
                </Link>
                <Link 
                  href="/profile" 
                  className="flex items-center gap-2 text-sm text-neutral-600 hover:text-[#4B2377] transition-colors font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>Mon profil</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:text-[#4B2377] border border-neutral-200 hover:border-[#4B2377] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-neutral-200">
                <Link 
                  href="/login" 
                  className="text-sm text-neutral-600 hover:text-[#4B2377] transition-colors font-medium"
                >
                  Se connecter
                </Link>
                <Link 
                  href="/signup" 
                  className="px-6 py-2 bg-[#4B2377] text-white hover:bg-[#3d1d61] transition-colors text-sm font-medium"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-600 hover:text-[#4B2377] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div>
            <button
              className="text-sm text-neutral-600 hover:text-[#4B2377] transition-colors py-2 border border-neutral-200 rounded w-full mb-2"
              onClick={() => {
                setMobileMenuOpen(false);
                if (!isLoggedIn) {
                  router.push('/login');
                } else if (userRole === 'particulier') {
                  router.push('/dashboard/particulier');
                } else if (userRole === 'professionnel') {
                  router.push('/dashboard/professionnel');
                } else {
                  router.push('/profile');
                }
              }}
            >
              Dashboard
            </button>
            <div className="md:hidden py-4 border-t border-neutral-200">
              <nav className="flex flex-col gap-4">
                <Link 
                  href="/objets" 
                  className="text-sm text-neutral-600 hover:text-[#4B2377] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Objets
                </Link>
                <Link 
                  href="/encheres" 
                  className="text-sm text-neutral-600 hover:text-[#4B2377] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Enchères
                </Link>
                <Link 
                  href="/vendre" 
                  className="text-sm text-neutral-600 hover:text-[#4B2377] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Vendre
                </Link>
                <Link 
                  href="/comment-ca-marche" 
                  className="text-sm text-neutral-600 hover:text-[#4B2377] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Comment ça marche
                </Link>

                {isLoggedIn ? (
                  <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-neutral-200">
                    <Link 
                      href="/feedback" 
                      className="text-sm text-neutral-600 hover:text-[#4B2377] transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Donner un avis
                    </Link>
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-2 text-sm text-neutral-600 hover:text-[#4B2377] transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Mon profil</span>
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-sm text-neutral-600 hover:text-[#4B2377] transition-colors py-2 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-neutral-200">
                    <Link 
                      href="/login" 
                      className="text-sm text-neutral-600 hover:text-[#4B2377] transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Se connecter
                    </Link>
                    <Link 
                      href="/signup" 
                      className="px-6 py-3 bg-[#4B2377] text-white hover:bg-[#3d1d61] transition-colors text-sm text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      S'inscrire
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
