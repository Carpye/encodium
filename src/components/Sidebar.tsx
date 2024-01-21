"use client"
import { cn } from "@/lib/utils"
import { LayoutDashboard, MessageCircleMore } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

const Sidebar = () => {
  return (
    <div className="h-full border-r p-8 flex-col gap-2 hidden xl:flex">
      <SidebarItem
        name="Dashboard"
        href="/dashboard"
        icon={<LayoutDashboard />}
      />
      <SidebarItem
        name="Wiadomości"
        href="/dashboard/messages"
        icon={<MessageCircleMore />}
      />
    </div>
  )
}

interface SidebarItemProps {
  name: string
  href: string
  icon?: ReactNode
}

export function SidebarItem({ name, href, icon }: SidebarItemProps) {
  const pathname = usePathname()

  const active = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "py-2 px-4 hover:bg-zinc-100 rounded-lg flex gap-4 text-muted-foreground hover:text-foreground",
        active ? "bg-zinc-100 text-foreground" : "",
      )}
    >
      {icon} {name}
    </Link>
  )
}

export default Sidebar
