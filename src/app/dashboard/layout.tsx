import PathNavigator from "@/components/PathNavigator"
import Sidebar from "@/components/Sidebar"
import React, { PropsWithChildren } from "react"

const Layout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="h-full w-full flex flex-col">
        <PathNavigator />
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

export default Layout
