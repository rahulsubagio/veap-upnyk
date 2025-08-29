'use server'

import { createClient } from '@veap/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Ambil data dari form
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const targetDashboard = formData.get('dashboard') as string

  // 1. Coba untuk login
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    console.error('Sign-in error:', signInError.message)
    return redirect(`/login?dashboard=${targetDashboard}&message=Could not authenticate user`)
  }

  // 2. Ambil data user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect(`/login?dashboard=${targetDashboard}&message=User not found after sign-in`);
  }

  // 3. Ambil profil user
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, dashboard_access')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error('Profile error:', profileError?.message)
    await supabase.auth.signOut();
    return redirect(`/login?dashboard=${targetDashboard}&message=User profile not found`)
  }
  
  // 4. Logika Otorisasi
  const { role, dashboard_access } = profile;

  if (role === 'admin' && dashboard_access !== targetDashboard) {
    await supabase.auth.signOut();
    const requestHeaders = await headers();
    const origin = requestHeaders.get('origin') || 'http://localhost:3000'
    const loginUrl = new URL(`/login?dashboard=${targetDashboard}&message=You do not have access to this dashboard`, origin);
    return redirect(loginUrl.toString());
  }
  
  // 5. Arahkan ke dashboard
  return redirect(`/dashboard/${targetDashboard}`)
}

// --- FUNGSI BARU UNTUK GUEST ---
export async function guestLogin(formData: FormData) {
  // Ambil email dan password guest dari environment variables untuk keamanan
  const guestEmail = process.env.GUEST_EMAIL;
  const guestPassword = process.env.GUEST_PASSWORD;
  const targetDashboard = formData.get('dashboard') as string

  if (!guestEmail || !guestPassword) {
    console.error("GUEST_EMAIL atau GUEST_PASSWORD tidak diatur di .env.local");
    return redirect(`/login?dashboard=${targetDashboard}&message=Guest login is not configured.`);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: guestEmail,
    password: guestPassword,
  });

  if (error) {
    console.error('Guest sign-in error:', error.message);
    return redirect(`/login?dashboard=${targetDashboard}&message=Could not log in as Guest.`);
  }

  return redirect(`/dashboard/${targetDashboard}`);
}


export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/dashboard')
}

