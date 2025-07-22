import { createClient } from '@veap/lib/supabase/server';
import { Leaf } from 'lucide-react';
import { redirect } from 'next/navigation';
import UserDropdown from './userDropdown';
import { AuroraText } from '@veap/components/magicui/aurora-text';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100">
      <header className="sticky top-0 flex h-14 items-center justify-between gap-4 border-b bg-white px-4 md:px-6 z-10">
        <a href="/dashboard" className="flex items-center gap-2 w-full md:w-fit text-gray-800">
          <Leaf className="h-4 w-4 md:h-6 md:w-6 text-green-700" />
          <span className="font-bold text-base sm:text-xl">
            IoT Dashboard
            <span className="hidden sm:inline"> <AuroraText>Center</AuroraText></span> 
          </span>
        </a>
        <div className="flex w-full items-center md:ml-auto md:w-auto">
          <div className="ml-auto">
            <UserDropdown userEmail={user.email} />
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  )
}
