"use client"
import { trpc } from "@/app/_trpc/client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

const PathNavigator = () => {
  const pathname = usePathname()

  const splittedPath = pathname.split("/")

  return (
    <div className="w-full border-b px-4 py-2 flex gap-2">
      {splittedPath
        .filter((v) => v)
        .map((name) => (
          <Link
            className="hover:bg-zinc-50 rounded-md px-2"
            key={name}
            href={`/${name !== "dashboard" ? `dashboard/${name}` : name}`}
          >
            <span className="text-zinc-200 text-xl">/</span>{" "}
            <span className="text-zinc-500">{name}</span>
          </Link>
        ))}
    </div>
  )
}

export default PathNavigator
