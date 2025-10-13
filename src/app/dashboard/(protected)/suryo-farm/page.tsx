import DashboardClient from './components/client';
import { DockNavigation } from './components/dock';
import { createClient } from '@veap/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function SuryoFarmDashboardPage() {
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
      <h1 className="text-xl md:text-3xl text-center font-bold text-gray-800">Suryo Farm Dashboard</h1>
      {/* <p className="text-center text-gray-600 mt-2">Role Anda: <span className="font-semibold capitalize text-blue-800">{userRole.replace('_', ' ')}</span></p> */}
      <DashboardClient role={userRole} />
      <DockNavigation role={userRole} />
    </div>
  );
}
