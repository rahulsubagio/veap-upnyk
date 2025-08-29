import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// Definisikan tipe untuk profil pengguna agar lebih aman
type UserProfile = {
  id: string;
  role: 'super_admin' | 'admin' | 'guest';
  dashboard_access: string | null;
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Buat Supabase client yang bisa bekerja di server (middleware, server components)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Ambil data user saat ini
  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = req.nextUrl // Path yang sedang diakses, cth: /dashboard/green-pyramid

  // --- LOGIKA PROTEKSI ---

  // 1. Jika user BELUM login dan mencoba akses halaman dashboard manapun
  if (!user && pathname.startsWith('/dashboard/')) {
    // Arahkan ke halaman portal utama, bukan halaman login langsung
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // 2. Jika user SUDAH login
  if (user) {
    // A. Jika mencoba akses halaman login lagi, kembalikan ke portal
    if (pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // B. Ambil profil untuk cek role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, dashboard_access')
      .eq('id', user.id)
      .single() as { data: UserProfile | null };

    // Jika profil tidak ada, logout user untuk keamanan
    if (!profile) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    
    const { role, dashboard_access } = profile;

    // C. Jika role adalah 'admin', cegah akses ke dashboard lain via URL
    if (role === 'admin' && !pathname.startsWith(`/dashboard/${dashboard_access}`)) {
      // Cek agar tidak redirect dari halaman portal utama
      if (pathname !== '/dashboard') {
        return NextResponse.redirect(new URL(`/dashboard/${dashboard_access}`, req.url));
      }
    }
    
    // D. Jika role adalah 'guest', cegah akses ke halaman setting
    if (role === 'guest' && pathname.includes('/settings')) {
      // Arahkan kembali ke halaman portal dashboard atau dashboard spesifik
      const targetDashboard = pathname.split('/')[2] || '';
      return NextResponse.redirect(new URL(`/dashboard/${targetDashboard}`, req.url));
    }
  }

  // Jika tidak ada kondisi di atas yang terpenuhi, lanjutkan request
  return res
}

export const config = {
  // Middleware ini akan berjalan di semua path yang cocok dengan pola berikut
  matcher: [
    '/dashboard/:path*', // Semua halaman di dalam /dashboard
    '/login'             // Halaman login
  ],
}