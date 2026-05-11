"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  PlusCircle,
  Settings,
  CreditCard,
  FolderOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarLinks = [
  {
    title: "Workspace",
    href: "/workspace",
    icon: FolderOpen,
  },
  {
    title: "New Analysis",
    href: "/workspace/new",
    icon: PlusCircle,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Billing",
    href: "/settings/billing",
    icon: CreditCard,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-gray-50/50 hidden md:flex md:flex-col">
      <nav className="flex-1 space-y-1 p-4">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.title}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-primary/5 p-4">
          <p className="text-sm font-medium">Need more credits?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Upgrade to Pro for 100 credits/month
          </p>
          <Link href="/settings/billing">
            <Button size="sm" className="mt-3 w-full">
              Upgrade
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  )
}