'use server'

import { createClient } from '@veap/lib/supabase/server' 
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Ambil data dari form
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const dashboard = formData.get('dashboard') as string

  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    return redirect(`/login?dashboard=${dashboard}&message=Invalid email or password. Please try again.`)
  }

  redirect(`/dashboard/${dashboard}`)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/dashboard')
}
