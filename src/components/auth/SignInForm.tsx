import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { SignInValidator } from "@/lib/validators/signin"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "../ui/button"

import { Input } from "../ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  const form = useForm<z.infer<typeof SignInValidator>>({
    resolver: zodResolver(SignInValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof SignInValidator>) {
    setIsLoading(true)
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      // callbackUrl: "/profile",
      redirect: false,
    })

    if (res?.ok) {
      router.push("/dashboard")
      setIsLoading(false)
    }

    if (res?.error) {
      setIsLoading(false)
      if (res.status === 401) toast.error("Błędne dane logowania.")
      else toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-8"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@encodium.com"
                  {...field}
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <Button type="submit" className="self-center" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className=" animate-spin" />
          ) : (
            <span>Zaloguj</span>
          )}
        </Button>
      </form>
    </Form>
  )
}
