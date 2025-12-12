'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { LayoutDashboard, ShoppingBag, PlusCircle, User, MessageSquare, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const sidebarItems = [
  {
    title: "Vue d'ensemble",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Mes objets",
    href: "/dashboard/mes-objets",
    icon: ShoppingBag,
  },
  {
    title: "Vendre un objet",
    href: "/dashboard/vendre",
    icon: PlusCircle,
  },
  {
    title: "Mon profil",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Donner un avis",
    href: "/feedback",
    icon: MessageSquare,
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Desktop - Fixed */}
      <aside className="hidden w-64 flex-col border-r bg-muted/30 md:flex md:fixed md:inset-y-0 md:z-40 md:top-16">
        <div className="flex flex-col h-full py-6 px-4">
          <h2 className="mb-6 px-2 text-lg font-semibold tracking-tight">
            Mon Espace
          </h2>
          <nav className="flex-1 space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href && "font-semibold"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
          <Separator className="my-6" />
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content - Offset for fixed sidebar */}
      <main className="flex-1 md:ml-64 py-8 px-6 md:px-8">
        {children}
      </main>
    </div>
  )
}
