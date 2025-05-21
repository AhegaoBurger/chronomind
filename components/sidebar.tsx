"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, LayoutDashboard, Settings } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      href: "/dashboard/calendar",
      icon: Calendar,
      label: "Calendar",
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      label: "Settings",
    },
  ]

  return (
    <aside className="hidden w-64 border-r bg-background md:block">
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-1 p-3">
          {routes.map((route) => (
            <Link key={route.href} href={route.href}>
              <Button variant="ghost" className={cn("w-full justify-start", pathname === route.href && "bg-muted")}>
                <route.icon className="mr-2 h-5 w-5" />
                {route.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
