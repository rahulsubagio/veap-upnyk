import DashboardClient from './components/client';

export default async function SmartdecDashboardPage() {
  // const initialData = await getInitialSensorData();

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-gray-800">Smartdec</h1>
      {/* <p className="mt-1 text-gray-600">Menampilkan data real-time dari sensor portabel Anda.</p> */}
      
      {/* Merender komponen klien dan meneruskan data awal sebagai prop */}
      <DashboardClient />
    </div>
  );
}
