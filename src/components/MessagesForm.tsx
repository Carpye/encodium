"use client"
import { trpc } from "@/app/_trpc/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import { useRouter } from "next/navigation"
import { Check, ClipboardCopy, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  message: z.string().min(1),
})

const MessagesForm = () => {
  const encryptForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })

  const decryptForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  const { mutate: encrypt } = trpc.message.encrypt.useMutation({
    onError({ message }) {
      toast.error("Wystąpił nieoczekiwany problem. Spróbuj ponowie później.")
      setIsLoading(false)
    },
    onSuccess() {
      setIsLoading(false)
      encryptForm.reset()
      router.refresh()
    },
  })

  const { mutate: decrypt } = trpc.message.decrypt.useMutation({
    onError({ message }) {
      toast.error(
        "Nie udało się odszyfrować wiadomości. Sprawdź, czy wprowadzana wartość jest poprawna.",
      )
      setIsLoading(false)
    },
    onSuccess() {
      setIsLoading(false)
      decryptForm.reset()
      router.refresh()
    },
  })

  function onSubmit(
    values: z.infer<typeof formSchema>,
    mode: "encrypt" | "decrypt",
  ) {
    if (mode === "encrypt") {
      encrypt(values.message)
    } else if (mode === "decrypt") {
      decrypt(values.message)
    }
  }

  const [pasteClicked, setPasteClicked] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPasteClicked(false)
    }, 2000)

    return () => {
      clearInterval(timer)
    }
  }, [pasteClicked])

  return (
    <Tabs defaultValue="encrypt" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="encrypt" className="w-full">
          Zaszyfruj
        </TabsTrigger>
        <TabsTrigger value="decrypt" className="w-full">
          Odszyfruj
        </TabsTrigger>
      </TabsList>
      <TabsContent value="encrypt">
        <Card>
          <CardContent className="flex justify-center pt-4">
            <Form {...encryptForm}>
              <form
                onSubmit={encryptForm.handleSubmit((values) => {
                  onSubmit(values, "encrypt")
                  setIsLoading(true)
                })}
                className="flex flex-col gap-4 w-[400px]"
              >
                <FormField
                  control={encryptForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wiadomość</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            placeholder="Super sekretna wiadomość..."
                            className="border-r-0 rounded-r-none  focus-visible:ring-0"
                            {...field}
                          />
                          <div className="border border-l-0 rounded-r-md grid place-items-center px-1">
                            <Button
                              type="button"
                              variant={"ghost"}
                              size={"icon"}
                              onClick={async () => {
                                setPasteClicked(true)
                                encryptForm.setValue(
                                  "message",
                                  await navigator.clipboard.readText(),
                                )
                              }}
                              className="transition h-8 w-8 text-muted-foreground relative"
                            >
                              <Check
                                className={cn("absolute  transition-all", {
                                  "rotate-180 scale-0": !pasteClicked,
                                })}
                              />
                              <ClipboardCopy
                                className={cn("absolute transition-all", {
                                  "-rotate-180 scale-0": pasteClicked,
                                })}
                              />

                              {/* {pasteClicked ? <Check /> : <ClipboardCopy />} */}
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} type="submit">
                  {isLoading ? (
                    <Loader2 className=" animate-spin" />
                  ) : (
                    <span>Zaszyfruj</span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="decrypt">
        <Card>
          <CardContent className="flex justify-center pt-4">
            <Form {...decryptForm}>
              <form
                onSubmit={decryptForm.handleSubmit((values) =>
                  onSubmit(values, "decrypt"),
                )}
                className="flex flex-col gap-4 w-[400px]"
              >
                <FormField
                  control={decryptForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wiadomość</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            placeholder="58a5828421dbed44fc20b9ae97f96e07"
                            className="border-r-0 rounded-r-none focus-visible:ring-0"
                            {...field}
                          />
                          <div className="border border-l-0 rounded-r-md grid place-items-center px-1">
                            <Button
                              type="button"
                              variant={"ghost"}
                              size={"icon"}
                              onClick={async () => {
                                setPasteClicked(true)
                                decryptForm.setValue(
                                  "message",
                                  await navigator.clipboard.readText(),
                                )
                              }}
                              className="transition h-8 w-8 text-muted-foreground relative"
                            >
                              <Check
                                className={cn("absolute  transition-all", {
                                  "rotate-180 scale-0": !pasteClicked,
                                })}
                              />
                              <ClipboardCopy
                                className={cn("absolute transition-all", {
                                  "-rotate-180 scale-0": pasteClicked,
                                })}
                              />

                              {/* {pasteClicked ? <Check /> : <ClipboardCopy />} */}
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} type="submit">
                  {isLoading ? (
                    <Loader2 className=" animate-spin" />
                  ) : (
                    <span>Odszyfruj</span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default MessagesForm
