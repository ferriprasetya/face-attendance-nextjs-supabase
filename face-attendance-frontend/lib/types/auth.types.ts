// lib/types/auth.types.ts

// Tipe ini akan menjadi standar return value dari server action kita
export type AuthActionResult = {
  success: boolean
  message: string
}

export type LoginFormValues = {
  email: string
  password: string
}
