import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { caller } from "@/trpc"
import React from "react"

const page = async () => {
  const messagesCount = await caller.message.get()

  return (
    <div className="p-4 flex flex-wrap gap-8">
      <StatCard name="Zapisane wiadomości" value={messagesCount.length} />

      <StatCard
        name="Zaszyfrowane wiadomości"
        value={messagesCount.filter((message) => message.isEncrypted).length}
        className="text-green-500"
      />

      <StatCard
        name="Odszyfrowane wiadomości"
        value={messagesCount.filter((message) => !message.isEncrypted).length}
        className="text-blue-500"
      />
    </div>
  )
}

function StatCard({
  name,
  value,
  className,
}: {
  name: string
  value: number
  className?: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className={className}>{value}</CardContent>
    </Card>
  )
}

export default page
