"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Terminal,
  Activity,
  Settings,
  Database,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarLinks = [
  {
    title: "Active Workspaces",
    href: "/workspace",
    icon: Terminal,
  },
  {
    title: "New Analysis",
    href: "/workspace/new",
    icon: Activity,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Compute Allocation",
    href: "/settings/billing",
    icon: Database,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border/40 bg-muted/5 hidden md:flex md:flex-col">
      <div className="mb-6 mt-4 px-6 flex items-center gap-2">
         <div className="flex gap-1.5 opacity-50">
           <div className="h-2 w-2 rounded-full bg-red-500" />
           <div className="h-2 w-2 rounded-full bg-yellow-500" />
           <div className="h-2 w-2 rounded-full bg-green-500" />
         </div>
         <span className="font-mono text-xs text-muted-foreground ml-2">valisearch-env</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/workspace" && pathname.startsWith(link.href + "/"))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 border",
                isActive
                  ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border-transparent"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.title}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border/40 p-4">
        <div className="rounded-lg bg-muted/20 border border-border/50 p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 blur-2xl rounded-full"></div>
          <p className="text-sm font-semibold tracking-tight relative z-10">Low Compute</p>
          <p className="mt-1 text-xs text-muted-foreground relative z-10">
            Upgrade allocation for heavy analysis execution.
          </p>
          <Link href="/settings/billing" className="relative z-10">
            <Button size="sm" variant="secondary" className="mt-3 w-full border border-border/50 text-xs font-semibold">
              Manage Allocation
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  )
}