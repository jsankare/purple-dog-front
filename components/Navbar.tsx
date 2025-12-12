'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { LogOut, User, LayoutDashboard, ShoppingBag } from 'lucide-react'

export function Navbar() {
  const { user, logout, isLoading } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center flex justify-between px-4 md:px-8 mx-auto max-w-7xl">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-xl" style={{ color: 'var(--primary)' }}>
              Purple Dog
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/catalogue" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Catalogue
            </Link>
            <Link href="/dashboard/vendre" className="hidden md:block transition-colors hover:text-foreground/80 text-foreground/60">
              Vendre
            </Link>
            <Link href="/comment-ca-marche" className="hidden md:block transition-colors hover:text-foreground/80 text-foreground/60">
              Comment ça marche
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {isLoading ? (
            <div className="flex items-center gap-4">
               <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
               <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-4">
              {user.role === 'professionnel' ? (
                <Badge className="bg-indigo-600 hover:bg-indigo-700">PRO</Badge>
              ) : (
                <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">Particulier</Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt={user.firstName} />
                      <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/mes-objets">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>Mes objets</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mon profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ModeToggle />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Se connecter</Link>
              </Button>
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Link href="/register">S'inscrire</Link>
              </Button>
              <ModeToggle />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
