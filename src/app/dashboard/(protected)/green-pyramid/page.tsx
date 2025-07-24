import DashboardClient from './components/client';
import { DockNavigation } from './components/dock';

export default async function GreenPyramidDashboardPage() {
  // const initialData = await getInitialSensorData();

  return (
    <div>
      <h1 className="text-xl md:text-3xl text-center font-bold text-gray-800">Green Pyramid Dashboard</h1>
      <DashboardClient />
      <DockNavigation />
    </div>
  );
}
