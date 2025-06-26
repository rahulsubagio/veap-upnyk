// src/app/dashboard/layout.tsx
import { createClient } from '@veap/lib/supabase/server' // Pastikan path ini sesuai
import { LogOut, Leaf } from 'lucide-react'
import { redirect } from 'next/navigation'
import { logout } from '@veap/app/login/actions' // Pastikan import dari lokasi yang benar

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // --- PERBAIKAN UTAMA DI SINI: Tambahkan 'await' ---
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Arahkan ke portal jika tidak ada user yang login
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 z-10">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <a
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold md:text-base text-gray-800"
          >
            <Leaf className="h-6 w-6 text-green-700" />
            <span className="font-bold">IoT Dashboard Center</span>
          </a>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial">
             <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 hidden sm:inline">
                  Logged in as:
                </span>
                <span className="text-sm font-medium">{user.email}</span>
             </div>
          </div>
          <form action={logout}>
            <button className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  )
}
