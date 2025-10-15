import { createClient } from "@veap/lib/supabase/server";
import { DataTableClient } from "./components/data-table-client";
import { DockNavigation } from "../components/dock";
import { redirect } from 'next/navigation';

// Tipe data tetap sama
export type LogData = {
  id: number;
  created_at: string;
  ec: number | null;
  tds: number | null;
  ph: number | null;
  water_temp: number | null;
  room_temp: number | null;
  humidity: number | null;
  tvoc: number | null;
  co2: number | null;
};

const ROWS_PER_PAGE = 25; // Jumlah data default yang ditampilkan per halaman

// Fungsi untuk mengambil data awal (halaman pertama)
async function getInitialData() {
  const supabase = await createClient();
  
  // 1. Ambil data untuk halaman pertama
  const { data, error } = await supabase
    .from("logs_indoor_hydroponic")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, ROWS_PER_PAGE - 1); // Ambil data dari baris 0 sampai 24

  // 2. Ambil total jumlah data untuk paginasi
  const { count, error: countError } = await supabase
    .from("logs_indoor_hydroponic")
    .select('*', { count: 'exact', head: true });

  if (error || countError) {
    console.error("Error fetching initial data:", error || countError);
    return { initialData: [], totalCount: 0 };
  }

  return { initialData: data, totalCount: count ?? 0 };
}

export default async function DataPage() {
  const { initialData, totalCount } = await getInitialData();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/dashboard'); 
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  const userRole = profile?.role || 'guest';

  return (
    <div className="container mx-auto py-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold">Data Logs</h1>
        <p className="text-gray-500 mt-1">
          Jelajahi dan unduh histori data sensor dari dashboard Indoor Hydroponik.
        </p>
      </div>
      
      <DataTableClient 
        initialData={initialData} 
        totalCount={totalCount} 
      />
      <DockNavigation role={userRole} />
    </div>
  );
}

