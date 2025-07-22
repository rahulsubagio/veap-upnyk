// src/app/dashboard/(protected)/indoor-hidroponic/components/HidroponikDashboardClient.tsx
"use client";

import { useEffect, useState } from 'react';
import client from '@veap/lib/mqttClient'; // Pastikan path ini sesuai
import { Line } from 'react-chartjs-2';
import { DockNavigation } from './dock';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  ChartDataset
} from 'chart.js';
import 'chart.js/auto';
import { Thermometer, Droplets, TestTube, Waves, Power, Zap } from 'lucide-react';

// Daftarkan komponen Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Tipe untuk data terbaru dari sensor
interface LatestData {
  ec?: number;
  tds?: number;
  ph?: number;
  water_temp?: number;
  room_temp?: number;
  humidity?: number;
  pompa_nutrisi_ab?: 'ON' | 'OFF';
  pompa_ph_up?: 'ON' | 'OFF';
  pompa_ph_down?: 'ON' | 'OFF';
}

export default function HidroponikDashboardClient() {
  const [latestData, setLatestData] = useState<LatestData>({});
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const [ecTdsChartData, setEcTdsChartData] = useState<ChartData<'line'>>({ labels: [], datasets: [] });
  const [phWaterTempChartData, setPhWaterTempChartData] = useState<ChartData<'line'>>({ labels: [], datasets: [] });
  const [roomTempHumidityChartData, setRoomTempHumidityChartData] = useState<ChartData<'line'>>({ labels: [], datasets: [] });

  // Fungsi helper untuk update data grafik
  const updateChartData = (prevData: ChartData<'line'>, time: string, newValues: { [key: string]: number | undefined }) => {
    const newLabels = [...(prevData.labels || []), time].slice(-30);
    const newDatasets = (prevData.datasets || []).map((dataset: ChartDataset<'line'>) => {
      const newValue = newValues[dataset.label || ''] ?? (dataset.data.length > 0 ? dataset.data[dataset.data.length - 1] : 0);
      const newData = [...dataset.data, newValue].slice(-30);
      return { ...dataset, data: newData };
    });
    return { labels: newLabels, datasets: newDatasets };
  };

  useEffect(() => {
    const initializeCharts = () => {
      setEcTdsChartData({
        labels: [],
        datasets: [
          { label: 'EC (uS/cm)', data: [], borderColor: 'rgb(239, 68, 68)', yAxisID: 'y_ec', tension: 0.3 },
          { label: 'TDS (ppm)', data: [], borderColor: 'rgb(249, 115, 22)', yAxisID: 'y_tds', tension: 0.3 }
        ]
      });
      setPhWaterTempChartData({
        labels: [],
        datasets: [
          { label: 'Water pH', data: [], borderColor: 'rgb(34, 197, 94)', yAxisID: 'y_ph', tension: 0.3 },
          { label: 'Water Temp (°C)', data: [], borderColor: 'rgb(59, 130, 246)', yAxisID: 'y_temp', tension: 0.3 }
        ]
      });
      setRoomTempHumidityChartData({
        labels: [],
        datasets: [
          { label: 'Room Temp (°C)', data: [], borderColor: 'rgb(217, 70, 239)', yAxisID: 'y_temp', tension: 0.3 },
          { label: 'Humidity (%)', data: [], borderColor: 'rgb(100, 116, 139)', yAxisID: 'y_humidity', tension: 0.3 }
        ]
      });
    };
    initializeCharts();

    const handleConnect = () => { setIsConnected(true); client.subscribe('hidroponik/data'); };
    const handleDisconnect = () => setIsConnected(false);
    const handleMessage = (topic: string, message: Buffer) => {
      if (topic === 'hidroponik/data') {
        try {
          const data: LatestData = JSON.parse(message.toString());
          setLatestData((prev: LatestData) => ({ ...prev, ...data }));

          const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

          setEcTdsChartData((prev: ChartData<'line'>) => updateChartData(prev, time, { 'EC (uS/cm)': data.ec, 'TDS (ppm)': data.tds }));
          setPhWaterTempChartData((prev: ChartData<'line'>) => updateChartData(prev, time, { 'Water pH': data.ph, 'Water Temp (°C)': data.water_temp }));
          setRoomTempHumidityChartData((prev: ChartData<'line'>) => updateChartData(prev, time, { 'Room Temp (°C)': data.room_temp, 'Humidity (%)': data.humidity }));
        } catch (e) { console.error(e); }
      }
    };

    setIsConnected(client.connected);
    client.on('connect', handleConnect);
    client.on('message', handleMessage);
    client.on('close', handleDisconnect);
    if (client.connected) handleConnect();

    return () => {
      client.off('connect', handleConnect);
      client.off('message', handleMessage);
      client.off('close', handleDisconnect);
    };
  }, []);

  const createChartOptions = (title: string, y1Label: string, y1Key: string, y2Label: string, y2Key: string): ChartOptions<'line'> => ({
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top' }, title: { display: true, text: title } },
    interaction: { mode: 'index', intersect: false },
    scales: {
      [y1Key]: { type: 'linear', display: true, position: 'left', title: { display: true, text: y1Label } },
      [y2Key]: { type: 'linear', display: true, position: 'right', title: { display: true, text: y2Label }, grid: { drawOnChartArea: false } },
    }
  });
  
  const PumpStatusCard = ({ name, status }: { name: string, status: 'ON' | 'OFF' | undefined }) => (
    <div className="rounded-xl border bg-white p-4 shadow-sm flex justify-between items-center">
      <div className="flex items-center gap-3"><Power className={`w-6 h-6 ${status === 'ON' ? 'text-green-500' : 'text-gray-400'}`} /><p className="font-medium text-gray-700">{name}</p></div>
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${status === 'ON' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{status ?? 'N/A'}</span>
    </div>
  );

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center gap-2">
        {isConnected !== null ? (
          <>
            <span className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className="text-sm text-gray-600">MQTT Status: {isConnected ? 'Connected' : 'Disconnected'}</span>
          </>
        ) : (
          <span className="text-sm text-gray-400">Checking MQTT connection...</span>
        )}
      </div>

      {/* --- PERBAIKAN: Mengganti 'items-start' menjadi 'items-center' --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm flex items-center gap-4"><Zap className="w-8 h-8 text-yellow-500" /><div><p className="text-sm text-gray-500">EC</p><p className="text-2xl font-bold">{latestData.ec?.toFixed(0) ?? '...'}<span className="text-base font-normal"> uS/cm</span></p></div></div>
        <div className="rounded-xl border bg-white p-4 shadow-sm flex items-center gap-4"><Waves className="w-8 h-8 text-cyan-500" /><div><p className="text-sm text-gray-500">TDS</p><p className="text-2xl font-bold">{latestData.tds?.toFixed(0) ?? '...'}<span className="text-base font-normal"> ppm</span></p></div></div>
        <div className="rounded-xl border bg-white p-4 shadow-sm flex items-center gap-4"><TestTube className="w-8 h-8 text-green-500" /><div><p className="text-sm text-gray-500">Water pH</p><p className="text-2xl font-bold">{latestData.ph?.toFixed(2) ?? '...'}</p></div></div>
        <div className="rounded-xl border bg-white p-4 shadow-sm flex items-center gap-4"><Thermometer className="w-8 h-8 text-red-500" /><div><p className="text-sm text-gray-500">Water Temp</p><p className="text-2xl font-bold">{latestData.water_temp?.toFixed(1) ?? '...'}°C</p></div></div>
        <div className="rounded-xl border bg-white p-4 shadow-sm flex items-center gap-4"><Thermometer className="w-8 h-8 text-orange-500" /><div><p className="text-sm text-gray-500">Room Temp</p><p className="text-2xl font-bold">{latestData.room_temp?.toFixed(1) ?? '...'}°C</p></div></div>
        <div className="rounded-xl border bg-white p-4 shadow-sm flex items-center gap-4"><Droplets className="w-8 h-8 text-indigo-500" /><div><p className="text-sm text-gray-500">Humidity</p><p className="text-2xl font-bold">{latestData.humidity?.toFixed(1) ?? '...'}%</p></div></div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700">Pump Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          <PumpStatusCard name="Nutrient A/B" status={latestData.pompa_nutrisi_ab} />
          <PumpStatusCard name="pH Up" status={latestData.pompa_ph_up} />
          <PumpStatusCard name="pH Down" status={latestData.pompa_ph_down} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-white p-4 md:p-6 shadow-sm">
          <div className="h-80 w-full"><Line options={createChartOptions('Water Quality', 'EC (uS/cm)', 'y_ec', 'TDS (ppm)', 'y_tds')} data={ecTdsChartData} /></div>
        </div>
        <div className="rounded-xl border bg-white p-4 md:p-6 shadow-sm">
          <div className="h-80 w-full"><Line options={createChartOptions('Water Parameters', 'Water pH', 'y_ph', 'Water Temp (°C)', 'y_temp')} data={phWaterTempChartData} /></div>
        </div>
        <div className="rounded-xl border bg-white p-4 md:p-6 shadow-sm lg:col-span-2">
          <div className="h-80 w-full"><Line options={createChartOptions('Room Conditions', 'Room Temp (°C)', 'y_temp', 'Humidity (%)', 'y_humidity')} data={roomTempHumidityChartData} /></div>
        </div>
      </div>
      <DockNavigation />
    </div>
  );
}
