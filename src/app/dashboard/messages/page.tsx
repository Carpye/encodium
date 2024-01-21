import Messages from "@/components/Messages"
import MessagesForm from "@/components/MessagesForm"
import { caller } from "@/trpc"
import { revalidatePath, unstable_noStore } from "next/cache"

export const dynamic = "force-dynamic"
revalidatePath("/dashboard/messages", "page")

const page = async () => {
  const messages = await caller.message.get()

  return (
    <div className="flex flex-col">
      <MessagesForm />
      <Messages messages={messages} />
    </div>
  )
}

export default page
