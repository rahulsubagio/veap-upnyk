// src/app/dashboard/(protected)/smartdec/kalibrasi/page.tsx
import CalibrationClient from './components/client';
import { DockNavigation } from '../components/dock';

export default function CalibrationPage() {
  return (
    <div className="relative pb-24">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Remote Calibration: Smartdec</h1>
        <p className="mt-1 text-gray-600">
          Calibrate your device remotely. Ensure sensors are in the correct conditions as instructed.
        </p>
      </div>
      
      <CalibrationClient />

      <DockNavigation />
    </div>
  );
}
