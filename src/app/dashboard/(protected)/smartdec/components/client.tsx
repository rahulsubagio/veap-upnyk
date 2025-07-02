"use client";

import { useEffect, useState } from 'react';
import client from '@veap/lib/mqttClient';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
  ChartData
} from 'chart.js';
import 'chart.js/auto';
import { Thermometer, Droplets, TestTube, Waves } from 'lucide-react';
import { DockNavigation } from './dock';

// Daftarkan komponen Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

export default function SmartdecDashboardClient() {
  // State untuk data kartu individu, mulai dari nilai default
  const [latestData, setLatestData] = useState({
    temperature: 0,
    soil_moisture: 0,
    ph: 0,
    tds: 0,
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
  });

  // State untuk data grafik Chart.js, mulai dari keadaan kosong
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        yAxisID: 'y',
        tension: 0.3,
      },
      {
        label: 'Soil Moisture (%)',
        data: [],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        yAxisID: 'y1',
        tension: 0.3,
      },
    ],
  });
  
  // Inisialisasi state koneksi ke null untuk mencegah hydration error
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Fungsi ini akan dijalankan HANYA di sisi klien setelah komponen dimuat
    const updateConnectionStatus = () => {
      setIsConnected(client.connected);
    };

    const handleConnect = () => {
      console.log('Connected to MQTT Broker!');
      setIsConnected(true);
      client.subscribe('smartdec/sensor_data', (err) => {
        if (!err) console.log('Subscribed to smartdec/sensor_data');
      });
    };

    const handleMessage = (topic: string, message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Update state untuk kartu data secara aman
        setLatestData(prev => ({ ...prev, ...data }));

        // Update state untuk grafik dengan logika yang defensif
        setChartData(prevChartData => {
          const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
          const newLabels = [...(prevChartData.labels || []), time].slice(-30);

          const newDatasets = (prevChartData.datasets || []).map(dataset => {
            const lastValue = dataset.data.length > 0 ? dataset.data[dataset.data.length - 1] : 0;
            let newValue = lastValue;

            if (dataset.label?.includes('Temperature') && typeof data.temperature === 'number') {
                newValue = data.temperature;
            } else if (dataset.label?.includes('Soil Moisture') && typeof data.soil_moisture === 'number') {
                newValue = data.soil_moisture;
            }
            
            const newData = [...dataset.data, newValue].slice(-30);
            return { ...dataset, data: newData };
          });

          return { labels: newLabels, datasets: newDatasets };
        });

      } catch (e) {
        console.error('Failed to parse MQTT message:', e);
      }
    };

    const handleDisconnect = () => {
        console.log('Disconnected from MQTT Broker.');
        setIsConnected(false);
    };

    // Set status awal saat komponen pertama kali dimuat di klien
    updateConnectionStatus();

    client.on('connect', handleConnect);
    client.on('message', handleMessage);
    client.on('close', handleDisconnect);

    return () => {
      client.off('connect', handleConnect);
      client.off('message', handleMessage);
      client.off('close', handleDisconnect);
    };
  }, []);

  // Opsi konfigurasi untuk Chart.js
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Data Sensor Real-Time' },
    },
    scales: {
      y: {
          type: 'linear' as const,
          display: true,
          position: 'left' as const,
          title: { display: true, text: 'Temperature (°C)' }
      },
      y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          title: { display: true, text: 'Soil Moisture (%)' },
          grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Indikator Status Koneksi */}
      <div className="flex items-center gap-2">
        {isConnected !== null ? (
          <>
            <span className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className="text-sm text-gray-600">
                MQTT Status: {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </>
        ) : (
          <span className="text-sm text-gray-400">Checking MQTT connection...</span>
        )}
      </div>

      {/* Kartu Data Sensor */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm flex items-center gap-4">
          <Thermometer className="w-8 h-8 text-amber-500" />
          <div><p className="text-xs md:text-sm text-gray-500">Temperature</p><p className="text-xl md:text-2xl font-bold">{latestData.temperature.toFixed(1)} °C</p></div>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm flex items-center gap-4">
          <Droplets className="w-8 h-8 text-blue-500" />
          <div><p className="text-xs md:text-sm text-gray-500">Soil Moisture</p><p className="text-xl md:text-2xl font-bold">{latestData.soil_moisture.toFixed(1)} %</p></div>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm flex items-center gap-4">
          <TestTube className="w-8 h-8 text-green-500" />
          <div><p className="text-xs md:text-sm text-gray-500">pH</p><p className="text-xl md:text-2xl font-bold">{latestData.ph.toFixed(2)}</p></div>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm flex items-center gap-4">
          <Waves className="w-8 h-8 text-cyan-500" />
          <div><p className="text-xs md:text-sm text-gray-500">TDS</p><p className="text-xl md:text-2xl font-bold">{latestData.tds.toFixed(0)} ppm</p></div>
        </div>
      </div>
      
      {/* Kartu Data NPK */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Nutrisi Makro (NPK)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          <div className="rounded-xl border bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Nitrogen (N)</p><p className="text-2xl font-bold">{latestData.nitrogen} <span className="text-lg font-normal text-gray-600">mg/kg</span></p></div>
          <div className="rounded-xl border bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Fosfor (P)</p><p className="text-2xl font-bold">{latestData.phosphorus} <span className="text-lg font-normal text-gray-600">mg/kg</span></p></div>
          <div className="rounded-xl border bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Kalium (K)</p><p className="text-2xl font-bold">{latestData.potassium} <span className="text-lg font-normal text-gray-600">mg/kg</span></p></div>
        </div>
      </div>

      {/* Grafik Time-Series */}
      <div className="rounded-xl border bg-white p-4 md:p-6 shadow-sm">
        <div className="h-96 w-full">
          <Line options={options} data={chartData} />
        </div>
      </div>

      {/* Navigasi Dock */}
      <DockNavigation />
    </div>
  );
}
