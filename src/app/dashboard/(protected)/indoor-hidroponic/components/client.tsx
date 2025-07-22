'use client';

import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';
import { Thermometer, Droplets, FlaskConical, Zap, Power, Bot, User, RefreshCw, ChevronsUp, ChevronsDown, Waves } from 'lucide-react';
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
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// --- Tipe Data ---
type SensorData = {
  ec: number | null;
  tds: number | null;
  ph: number | null;
  water_temp: number | null;
  room_temp: number | null;
  humidity: number | null;
};

type ControlMode = 'manual' | 'auto';

type ChartDataState = {
  labels: string[];
  ec: (number | null)[];
  tds: (number | null)[];
  ph: (number | null)[];
  water_temp: (number | null)[];
  room_temp: (number | null)[];
  humidity: (number | null)[];
};

const MAX_CHART_POINTS = 20;

const initialSensorData: SensorData = { ec: null, tds: null, ph: null, water_temp: null, room_temp: null, humidity: null };
const initialChartData: ChartDataState = { labels: [], ec: [], tds: [], ph: [], water_temp: [], room_temp: [], humidity: [] };

// PERBAIKAN: Pindahkan konstanta ke luar komponen
const SENSOR_DATA_TOPIC = 'indoorHidroponic/sensors/data';
const MODE_STATUS_TOPIC = 'indoorHidroponic/control/mode/status';
const MODE_COMMAND_TOPIC = 'indoorHidroponic/control/mode/command';

const actuatorTopics = {
  nutrisi: { command: 'indoorHidroponic/actuator/nutrisi/command', status: 'indoorHidroponic/actuator/nutrisi/status' },
  phUp: { command: 'indoorHidroponic/actuator/phUp/command', status: 'indoorHidroponic/actuator/phUp/status' },
  phDown: { command: 'indoorHidroponic/actuator/phDown/command', status: 'indoorHidroponic/actuator/phDown/status' },
  pump: { command: 'indoorHidroponic/actuator/pump/command', status: 'indoorHidroponic/actuator/pump/status' },
};

const DashboardClient = () => {
  // --- State Aplikasi ---
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [sensorData, setSensorData] = useState<SensorData>(initialSensorData);
  const [pompaNutrisiStatus, setPompaNutrisiStatus] = useState(false);
  const [pompaPhUpStatus, setPompaPhUpStatus] = useState(false);
  const [pompaPhDownStatus, setPompaPhDownStatus] = useState(false);
  const [pompaSirkulasiStatus, setPompaSirkulasiStatus] = useState(false);
  const [controlMode, setControlMode] = useState<ControlMode>('manual');
  const [chartData, setChartData] = useState<ChartDataState>(initialChartData);

  const dataTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Efek untuk Koneksi MQTT ---
  useEffect(() => {
    const brokerUrl = 'ws://147.93.96.15:9001';
    const options: mqtt.IClientOptions = {
      clientId: `nextjs-hidroponik-client-${Math.random().toString(16).substr(2, 8)}`,
    };

    const mqttClient = mqtt.connect(brokerUrl, options);
    setClient(mqttClient);

    const onConnect = () => {
      console.log('Terhubung ke broker MQTT!');
      
      mqttClient.subscribe(SENSOR_DATA_TOPIC, (err: Error | null) => !err && console.log(`Subscribed ke ${SENSOR_DATA_TOPIC}`));
      mqttClient.subscribe(MODE_STATUS_TOPIC, (err: Error | null) => !err && console.log(`Subscribed ke ${MODE_STATUS_TOPIC}`));
      Object.values(actuatorTopics).forEach(topic => {
        mqttClient.subscribe(topic.status, (err: Error | null) => !err && console.log(`Subscribed ke ${topic.status}`));
      });
    };

    const onMessage = (topic: string, message: Buffer) => {
      const payload = message.toString();
      
      if (topic === SENSOR_DATA_TOPIC) {
        if (dataTimeoutRef.current) {
          clearTimeout(dataTimeoutRef.current);
        }
        dataTimeoutRef.current = setTimeout(() => {
          console.warn("Tidak ada data sensor diterima selama 5 detik. Mereset tampilan.");
          setSensorData(initialSensorData);
          setChartData(initialChartData);
        }, 3000);

        try {
          const data: SensorData = JSON.parse(payload);
          setSensorData(data);
          setChartData(prevData => {
            const now = new Date();
            const newLabel = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            
            return {
              labels: [...prevData.labels, newLabel].slice(-MAX_CHART_POINTS),
              ec: [...prevData.ec, data.ec].slice(-MAX_CHART_POINTS),
              tds: [...prevData.tds, data.tds].slice(-MAX_CHART_POINTS),
              ph: [...prevData.ph, data.ph].slice(-MAX_CHART_POINTS),
              water_temp: [...prevData.water_temp, data.water_temp].slice(-MAX_CHART_POINTS),
              room_temp: [...prevData.room_temp, data.room_temp].slice(-MAX_CHART_POINTS),
              humidity: [...prevData.humidity, data.humidity].slice(-MAX_CHART_POINTS),
            };
          });

        } catch (e) {
          console.error("Gagal parse data sensor:", e);
        }
      } else if (topic === MODE_STATUS_TOPIC) {
        setControlMode(payload.toLowerCase() as ControlMode);
      } else if (topic === actuatorTopics.nutrisi.status) {
        setPompaNutrisiStatus(payload === 'ON');
      } else if (topic === actuatorTopics.phUp.status) {
        setPompaPhUpStatus(payload === 'ON');
      } else if (topic === actuatorTopics.phDown.status) {
        setPompaPhDownStatus(payload === 'ON');
      } else if (topic === actuatorTopics.pump.status) {
        setPompaSirkulasiStatus(payload === 'ON');
      }
    };

    const onError = (err: Error) => console.error('Koneksi MQTT Error: ', err);
    
    const onClose = () => {
      setSensorData(initialSensorData);
      setChartData(initialChartData);
      if (dataTimeoutRef.current) {
        clearTimeout(dataTimeoutRef.current);
      }
    };

    mqttClient.on('connect', onConnect);
    mqttClient.on('message', onMessage);
    mqttClient.on('error', onError);
    mqttClient.on('close', onClose);

    return () => {
      if (dataTimeoutRef.current) {
        clearTimeout(dataTimeoutRef.current);
      }
      if (mqttClient) {
        mqttClient.removeAllListeners();
        mqttClient.end();
      }
    };
  }, []);

  // --- Fungsi Handler ---
  const publishCommand = (topic: string, message: string) => {
    if (client && client.connected) {
      client.publish(topic, message);
    } else {
      console.warn('Tidak terhubung ke MQTT Broker.');
    }
  };

  const handleActuatorToggle = (actuator: 'nutrisi' | 'phUp' | 'phDown' | 'pump', currentStatus: boolean) => {
    if (controlMode === 'manual') {
      publishCommand(actuatorTopics[actuator].command, currentStatus ? 'OFF' : 'ON');
    }
  };

  const handleModeChange = () => {
    const newMode = controlMode === 'manual' ? 'auto' : 'manual';
    publishCommand(MODE_COMMAND_TOPIC, newMode.toUpperCase());
  };

  const isManualMode = controlMode === 'manual';

  // --- Konfigurasi Chart ---
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#475569' } },
      title: { display: true, color: '#1e293b', font: { size: 16 } },
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } },
      y: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } },
    },
  };

  return (
    <>
      <div className="mb-6 flex justify-end items-center">
        <button onClick={handleModeChange} className="flex items-center justify-center space-x-3 px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-gray-200 hover:bg-gray-300 text-gray-800">
            {controlMode === 'auto' ? <Bot className="text-cyan-600"/> : <User className="text-green-600"/>}
            <span>Mode: <span className="font-bold uppercase">{controlMode}</span></span>
        </button>
      </div>

      {/* Grid untuk Sensor */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <SensorCard icon={FlaskConical} label="pH Air" value={sensorData.ph?.toFixed(2) ?? '...'} unit="" color="text-green-500" />
        <SensorCard icon={Thermometer} label="Suhu Air" value={sensorData.water_temp?.toFixed(1) ?? '...'} unit="°C" color="text-blue-500" />
        <SensorCard icon={Waves} label="TDS" value={sensorData.tds?.toFixed(0) ?? '...'} unit="ppm" color="text-purple-500" />
        <SensorCard icon={Zap} label="EC" value={sensorData.ec?.toFixed(0) ?? '...'} unit="µS/cm" color="text-yellow-500" />
        <SensorCard icon={Thermometer} label="Suhu Ruang" value={sensorData.room_temp?.toFixed(1) ?? '...'} unit="°C" color="text-red-500" />
        <SensorCard icon={Droplets} label="Kelembapan" value={sensorData.humidity?.toFixed(1) ?? '...'} unit="%" color="text-cyan-500" />
      </div>

      {/* Grid untuk Kontrol */}
      <div className={`bg-white p-6 mb-6 rounded-lg shadow-md transition-opacity ${!isManualMode ? 'opacity-60 cursor-not-allowed' : ''}`}>
        <h3 className="text-xl font-semibold mb-4 text-slate-800">Kontrol Manual Pompa</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ActuatorButton label="Nutrisi AB Mix" icon={Droplets} status={pompaNutrisiStatus} onToggle={() => handleActuatorToggle('nutrisi', pompaNutrisiStatus)} disabled={!isManualMode} color="purple" />
          <ActuatorButton label="pH Up" icon={ChevronsUp} status={pompaPhUpStatus} onToggle={() => handleActuatorToggle('phUp', pompaPhUpStatus)} disabled={!isManualMode} color="sky" />
          <ActuatorButton label="pH Down" icon={ChevronsDown} status={pompaPhDownStatus} onToggle={() => handleActuatorToggle('phDown', pompaPhDownStatus)} disabled={!isManualMode} color="amber" />
          <ActuatorButton label="Sirkulasi Air" icon={RefreshCw} status={pompaSirkulasiStatus} onToggle={() => handleActuatorToggle('pump', pompaSirkulasiStatus)} disabled={!isManualMode} color="green" />
        </div>
          {!isManualMode && <p className="text-center text-xs text-amber-600 mt-4">Kontrol manual dinonaktifkan pada Mode Otomatis.</p>}
      </div>

      {/* Grid untuk Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-18">
        <div className="bg-white p-4 rounded-lg shadow-md h-64">
          <Line options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins?.title, text: 'TDS & EC'}}}} data={{ labels: chartData.labels, datasets: [ { label: 'TDS (ppm)', data: chartData.tds, borderColor: '#a855f7', backgroundColor: '#a855f733' }, { label: 'EC (µS/cm)', data: chartData.ec, borderColor: '#eab308', backgroundColor: '#eab30833' } ]}} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md h-64">
          <Line options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins?.title, text: 'pH & Suhu Air'}}}} data={{ labels: chartData.labels, datasets: [ { label: 'pH', data: chartData.ph, borderColor: '#22c55e', backgroundColor: '#22c55e33' }, { label: 'Suhu Air (°C)', data: chartData.water_temp, borderColor: '#3b82f6', backgroundColor: '#3b82f633' } ]}} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md h-64">
           <Line options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins?.title, text: 'Suhu & Kelembapan Ruang'}}}} data={{ labels: chartData.labels, datasets: [ { label: 'Suhu (°C)', data: chartData.room_temp, borderColor: '#ef4444', backgroundColor: '#ef444433' }, { label: 'Kelembapan (%)', data: chartData.humidity, borderColor: '#06b6d4', backgroundColor: '#06b6d433' } ]}} />
        </div>
      </div>
    </>
  );
};

// Komponen bantu untuk card sensor
const SensorCard = ({ icon: Icon, label, value, unit, color }: { icon: React.ElementType, label: string, value: string, unit: string, color: string }) => (
  <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-3">
    <Icon className={`w-8 h-8 flex-shrink-0 ${color}`} />
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value} <span className="text-lg font-normal text-gray-600">{unit}</span></p>
    </div>
  </div>
);

// Komponen bantu untuk tombol aktuator
const ActuatorButton = ({ label, icon: Icon, status, onToggle, disabled, color }: { label: string, icon: React.ElementType, status: boolean, onToggle: () => void, disabled: boolean, color: string }) => {
  const colorClasses = {
    purple: { text: 'text-purple-600', bg: 'bg-purple-500', hover: 'hover:bg-purple-600' },
    sky: { text: 'text-sky-600', bg: 'bg-sky-500', hover: 'hover:bg-sky-600' },
    amber: { text: 'text-amber-600', bg: 'bg-amber-500', hover: 'hover:bg-amber-600' },
    green: { text: 'text-green-600', bg: 'bg-green-500', hover: 'hover:bg-green-600' },
  };
  const selectedColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.purple;

  return (
    <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
      <div className="flex items-center space-x-3">
        <Icon className={`w-7 h-7 ${status ? selectedColor.text : 'text-gray-400'}`} />
        <div>
          <p className="font-semibold text-slate-700">{label}</p>
          <p className={`text-sm ${status ? selectedColor.text : 'text-gray-500'}`}>{status ? 'Menyala' : 'Mati'}</p>
        </div>
      </div>
      <button onClick={onToggle} disabled={disabled} className={`p-3 rounded-full transition-colors ${status ? `${selectedColor.bg} ${selectedColor.hover}` : 'bg-gray-300 hover:bg-gray-400'} disabled:bg-gray-200 disabled:cursor-not-allowed`}>
        <Power className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default DashboardClient;