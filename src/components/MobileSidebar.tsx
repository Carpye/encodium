import React from "react"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import { LayoutDashboard, Menu, MessageCircleMore } from "lucide-react"
import { SidebarItem } from "./Sidebar"

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"} size={"icon"} className="xl:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="!max-w-[250px]" side={"right"}>
        <div className="flex flex-col h-full items-center justify-between pt-8">
          <ul className="flex flex-col gap-4">
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
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar
