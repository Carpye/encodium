import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { randomBytes, createCipheriv, createDecipheriv } from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`
  return `http://localhost:${process.env.PORT ?? 3000}${path}`
}

export function encrypt(text: string) {
  // obtain keys
  const key = process.env.CIPHER_KEY!
  const iv = process.env.CIPHER_IV!

  const cipher = createCipheriv(
    "aes-256-cbc",
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64"),
  )

  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return encrypted.toString("hex")
}

export function decrypt(text: ReturnType<typeof encrypt>) {
  const key = process.env.CIPHER_KEY!
  const iv = process.env.CIPHER_IV!
  const encryptedText = Buffer.from(text, "hex")
  const decipher = createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64"),
  )
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}
