const crypto = require("crypto")
const algorithm = "aes-256-cbc" //Using AES encryption
const key = crypto.randomBytes(32)
const iv = crypto.randomBytes(16)

//Encrypting text
function encrypt(text) {
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") }
}

const res = encrypt("Hello World")

console.log(res)

// ! DZIALA TUTAJ ALE W TRPC NIE DZIALA, MOZLIWE ZE COS Z CIPHEREM ! //
