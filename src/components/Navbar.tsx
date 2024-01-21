"use client"
import { signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button"
import { Fingerprint, Loader2, LogOut } from "lucide-react"
import { useState } from "react"
import MobileSidebar from "./MobileSidebar"

const Navbar = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { data: session } = useSession()

  async function handleSignOut() {
    setIsLoading(true)
    await signOut()
  }

  return (
    <nav className="flex w-full items-center justify-between gap-4 border-b px-8 py-4 sticky top-0 left-0 backdrop-blur-md">
      <div className="p-4 font-bold text-2xl flex gap-2 items-center">
        <Fingerprint />
        Encodium
      </div>
      <div className="flex gap-4">
        {session?.user ? (
          <Button
            onClick={handleSignOut}
            disabled={isLoading}
            size={"icon"}
            variant={"ghost"}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <span>
                <LogOut />
              </span>
            )}
          </Button>
        ) : (
          ""
        )}
        <MobileSidebar />
      </div>
    </nav>
  )
}

export default Navbar
