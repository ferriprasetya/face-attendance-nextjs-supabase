'use server'

import { createClient } from '@/lib/supabase/server'
import { AuthActionResult } from '@/lib/types/auth.types'
import { redirect } from 'next/navigation'

/**
 * Server Action to handle user login.
 *
 * @param formData - The form data submitted by the user, expected to contain 'email' and 'password'.
 * @returns A promise that resolves to either a redirection on success or an error object on failure.
 */
export async function login(
  previousState: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  // 1. Extract email and password
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 2. Basic validation
  if (!email || !password) {
    return {
      success: false,
      message: 'Email and password are required.',
    }
  }

  // 3. Create a Supabase client
  const supabase = await createClient()

  // 4. Attempt to sign in
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // 5. Handle authentication errors
  if (error) {
    console.error('Authentication error:', error.message)
    return {
      success: false,
      message: 'Invalid login credentials. Please try again.',
    }
  }

  // 6. On success, redirect. This interrupts execution, so no return is needed.
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()

  // Logout dari Supabase
  await supabase.auth.signOut()
}
