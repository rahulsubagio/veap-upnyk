import DashboardClient from './components/client';
import { DockNavigation } from './components/dock';
import { createClient } from '@veap/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function SmartdecDashboardPage() {
  // const initialData = await getInitialSensorData();

  const supabase = await createClient();
  
    const { data: { user } } = await supabase.auth.getUser();
    
    // Pengaman jika middleware tidak berjalan, arahkan ke portal
    if (!user) {
      return redirect('/dashboard'); 
    }
  
    // Ambil profil pengguna dari database
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
  
    // Tentukan role, default ke 'guest' jika profil tidak ditemukan
    const userRole = profile?.role || 'guest';

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-gray-800">Smartdec</h1>
      {/* <p className="mt-1 text-gray-600">Menampilkan data real-time dari sensor portabel Anda.</p> */}
      
      {/* Merender komponen klien dan meneruskan data awal sebagai prop */}
      <DashboardClient />
      <DockNavigation role={userRole} />
    </div>
  );
}
