"use client"
import { cn } from "@/lib/utils"
import { Message } from "@prisma/client"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { useState } from "react"
import { toast } from "sonner"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Toggle } from "./ui/toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { ChevronDown, Dot } from "lucide-react"

const Messages = ({ messages }: { messages: Message[] }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    encrypted: true,
    decrypted: true,
  })

  const [messagesPivot, setMessagesPivot] = useState<number>(20)

  messages = messages.slice(0, messagesPivot)

  const filteredMessages =
    selectedFilters.decrypted && selectedFilters.encrypted
      ? messages
      : selectedFilters.decrypted
        ? messages.filter((msg) => !msg.isEncrypted)
        : selectedFilters.encrypted
          ? messages.filter((msg) => msg.isEncrypted)
          : []

  return (
    <div className="w-full max-h-full ">
      <div className="w-full flex justify-center md:justify-start py-4 gap-2">
        <Toggle
          value="encrypted"
          pressed={selectedFilters.encrypted}
          className="aria-pressed:!bg-green-100"
          onClick={() =>
            setSelectedFilters((prev) => ({
              ...prev,
              encrypted: !prev.encrypted,
            }))
          }
        >
          Zaszyfrowane
        </Toggle>
        <Toggle
          value="decrypted"
          pressed={selectedFilters.decrypted}
          className=" aria-pressed:!bg-blue-100"
          onClick={() =>
            setSelectedFilters((prev) => ({
              ...prev,
              decrypted: !prev.decrypted,
            }))
          }
        >
          Odszyfrowane
        </Toggle>
      </div>
      <div className="flex flex-wrap gap-2 overflow-y-scroll max-h-[500px] justify-center md:justify-start">
        {filteredMessages?.map((message, index) => (
          <Message message={message} key={index} />
        ))}
        <Button
          variant={"secondary"}
          className="w-full"
          onClick={() => setMessagesPivot((prev) => prev + 10)}
        >
          <ChevronDown />
        </Button>
      </div>
    </div>
  )
}

function Message({ message }: { message: Message }) {
  return (
    <div className="border rounded-xl p-2 flex flex-col gap-2 w-[200px] items-center">
      <TooltipProvider>
        <Tooltip delayDuration={250}>
          <TooltipTrigger asChild>
            <Button
              variant={"message"}
              size={"message"}
              className="max-w-full text-zinc-500 text-left text-md"
              onClick={() => {
                navigator.clipboard.writeText(message.content)
                toast.success("Skopiowano wiadomość.")
              }}
            >
              <span className="truncate">{message.content}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex items-center flex-col max-w-[800px] truncate">
            <p className="text-zinc-500">Klinij aby skopiować</p>
            <p className="truncate max-w-full">{message.content}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="text-xs text-right text-muted-foreground flex justify-between items-center w-full">
        <Badge
          variant={"outline"}
          className={cn(
            message.isEncrypted
              ? "bg-green-100 border-green-400 text-green-400"
              : "bg-blue-100 border-blue-400 text-blue-400",
          )}
        >
          {message.isEncrypted ? "encrypted" : "decrypted"}
        </Badge>
        {format(message.createdAt, "dd-LL-yyyy", { locale: pl })}
      </div>
    </div>
  )
}

export default Messages
