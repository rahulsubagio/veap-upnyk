// src/app/dashboard/(protected)/hidroponik/control/components/ControlClient.tsx
"use client";

import { useEffect, useState, FormEvent } from 'react';
import client from '@veap/lib/mqttClient'; // Pastikan path ini sesuai
import { DockNavigation } from '../../components/dock';
import { SlidersHorizontal, Hand, Bot, Save, AlertTriangle, CheckCircle, TestTube, RefreshCw } from 'lucide-react';

// Tipe untuk menyimpan semua pengaturan dan status dari perangkat
interface SystemState {
  mode?: 'auto' | 'manual';
  tds_min?: number;
  tds_max?: number;
  ph_min?: number;
  ph_max?: number;
  schedule1_hour?: number;
  schedule2_hour?: number;
  pompa_nutrisi_ab?: 'ON' | 'OFF';
  pompa_ph_up?: 'ON' | 'OFF';
  pompa_ph_down?: 'ON' | 'OFF';
}

export default function ControlClient() {
  const [state, setState] = useState<SystemState>({});
  const [statusMessage, setStatusMessage] = useState("Waiting for device status...");
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');

  // Fungsi untuk mengirim perintah umum ke ESP32
  const sendCommand = (payload: object) => {
    if (!client.connected) {
      alert("MQTT not connected. Cannot send command.");
      return;
    }
    const topic = "hidroponik/command";
    client.publish(topic, JSON.stringify(payload));
  };

  // Handler untuk mengubah mode
  const handleModeChange = (newMode: 'auto' | 'manual') => {
    sendCommand({ command: "set_mode", value: newMode });
  };

  // Handler untuk kontrol pompa manual
  const handleManualPump = (pump: string, pumpState: 'on' | 'off') => {
    sendCommand({ command: "manual_pump", pump, state: pumpState });
  };
  
  // Handler untuk menyimpan konfigurasi auto
  const handleSaveConfig = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const config = {
      command: "set_config",
      tds_min: parseFloat(formData.get('tds_min') as string),
      tds_max: parseFloat(formData.get('tds_max') as string),
      ph_min: parseFloat(formData.get('ph_min') as string),
      ph_max: parseFloat(formData.get('ph_max') as string),
      schedule1_hour: parseInt(formData.get('schedule1_hour') as string),
      schedule2_hour: parseInt(formData.get('schedule2_hour') as string),
    };
    sendCommand(config);
    setStatusMessage("Automation settings sent to device!");
    setMessageType('info');
  };

  // Handler untuk perintah kalibrasi pH
  const handlePhCalibration = (action: 'calibrate_ph7' | 'calibrate_ph4' | 'save_ph_calibration') => {
    sendCommand({ command: action });
    setStatusMessage(`pH calibration command '${action}' sent.`);
    setMessageType('info');
  };

  useEffect(() => {
    const handleMessage = (topic: string, message: Buffer) => {
      // Dengarkan data dari topik utama untuk update UI
      if (topic === "hidroponik/data") {
        try {
          const data = JSON.parse(message.toString());
          setState(prev => ({ ...prev, ...data }));
        } catch (e) { console.error("Failed to parse data message:", e); }
      }
      // Dengarkan status konfirmasi dari topik status
      if (topic === "hidroponik/status") {
        try {
          const data = JSON.parse(message.toString());
          setStatusMessage(`Device response: ${data.status}`);
          setMessageType('success');
        } catch(e) { console.error("Failed to parse status message:", e); }
      }
    };

    // Subscribe ke kedua topik
    client.subscribe("hidroponik/data");
    client.subscribe("hidroponik/status");
    client.subscribe("hidroponik/command");
    client.on("message", handleMessage);

    return () => { 
      client.off("message", handleMessage); 
    };
  }, []);

  const statusColors = {
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
  };

  return (
    <div className="space-y-8">
      {/* Status Box */}
      <div className={`border-l-4 p-4 rounded-r-lg ${statusColors[messageType]}`} role="alert">
        <div className="flex items-center">
          {messageType === 'info' && <AlertTriangle className="h-5 w-5 mr-3" />}
          {messageType === 'success' && <CheckCircle className="h-5 w-5 mr-3" />}
          {messageType === 'error' && <AlertTriangle className="h-5 w-5 mr-3" />}
          <div>
            <p className="font-bold">Status</p>
            <p>{statusMessage}</p>
          </div>
        </div>
      </div>

      {/* Pilihan Mode */}
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <h3 className="font-bold text-lg mb-2">Operation Mode</h3>
        <div className="flex rounded-lg border border-gray-200 p-1">
          <button onClick={() => handleModeChange('auto')} className={`flex-1 p-2 rounded-md flex items-center justify-center gap-2 transition-colors ${state.mode === 'auto' ? 'bg-blue-600 text-white shadow' : 'hover:bg-gray-100'}`}>
            <Bot className="w-5 h-5" /> Auto
          </button>
          <button onClick={() => handleModeChange('manual')} className={`flex-1 p-2 rounded-md flex items-center justify-center gap-2 transition-colors ${state.mode === 'manual' ? 'bg-blue-600 text-white shadow' : 'hover:bg-gray-100'}`}>
            <Hand className="w-5 h-5" /> Manual
          </button>
        </div>
      </div>

      {/* Panel Kontrol Manual */}
      {state.mode === 'manual' && (
        <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
          <h3 className="font-bold text-lg mb-4">Manual Pump Control</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PumpControlCard name="Nutrient A/B" status={state.pompa_nutrisi_ab} onToggle={(s) => handleManualPump('nutrisi', s)} />
            <PumpControlCard name="pH Up" status={state.pompa_ph_up} onToggle={(s) => handleManualPump('ph_up', s)} />
            <PumpControlCard name="pH Down" status={state.pompa_ph_down} onToggle={(s) => handleManualPump('ph_down', s)} />
          </div>
        </div>
      )}

      {/* Panel Pengaturan Auto */}
      {state.mode === 'auto' && (
        <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
          <h3 className="font-bold text-lg mb-4">Automation Settings</h3>
          <form onSubmit={handleSaveConfig} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputGroup label="TDS Threshold (ppm)" min={state.tds_min} max={state.tds_max} minName="tds_min" maxName="tds_max" />
              <InputGroup label="pH Threshold" min={state.ph_min} max={state.ph_max} minName="ph_min" maxName="ph_max" step={0.1} />
              <InputGroup label="Dosing Schedule (Hour)" min={state.schedule1_hour} max={state.schedule2_hour} minName="schedule1_hour" maxName="schedule2_hour" minLabel="Pagi" maxLabel="Sore" />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-white font-bold hover:bg-indigo-700">
              <Save className="w-5 h-5" /> Save Automation Settings
            </button>
          </form>
        </div>
      )}

      {/* Panel Kalibrasi pH */}
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <TestTube className="w-8 h-8 text-green-600" />
          <h3 className="text-xl font-bold text-gray-800">pH Sensor Calibration</h3>
        </div>
        <p className="text-gray-600 mb-4">Place the sensor in the appropriate buffer solution, then press the button to capture the voltage value.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => handlePhCalibration('calibrate_ph7')} className="flex-1 rounded-lg bg-gray-700 px-4 py-2 text-white font-semibold hover:bg-gray-800">Capture pH 7.0</button>
          <button onClick={() => handlePhCalibration('calibrate_ph4')} className="flex-1 rounded-lg bg-gray-700 px-4 py-2 text-white font-semibold hover:bg-gray-800">Capture pH 4.0</button>
          <button onClick={() => handlePhCalibration('save_ph_calibration')} className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-white font-bold hover:bg-indigo-700">Save pH Calibration</button>
        </div>
      </div>
      <DockNavigation />
    </div>
  );
}

// Komponen kecil untuk kartu kontrol pompa
const PumpControlCard = ({ name, status, onToggle }: { name: string, status?: 'ON' | 'OFF', onToggle: (state: 'on' | 'off') => void }) => (
  <div className="p-4 border rounded-lg flex items-center justify-between">
    <span className="font-medium">{name}</span>
    <div className="flex gap-2">
      <button onClick={() => onToggle('on')} className={`px-4 py-1 rounded transition-colors ${status === 'ON' ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>ON</button>
      <button onClick={() => onToggle('off')} className={`px-4 py-1 rounded transition-colors ${status === 'OFF' ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>OFF</button>
    </div>
  </div>
);

// Komponen kecil untuk grup input
const InputGroup = ({ label, min, max, minName, maxName, minLabel="Min", maxLabel="Max", step=1 }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="flex items-center gap-4 mt-1">
      <div className="w-full">
        <label className="text-xs text-gray-500">{minLabel}</label>
        <input type="number" name={minName} defaultValue={min} key={min} step={step} className="w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <div className="w-full">
        <label className="text-xs text-gray-500">{maxLabel}</label>
        <input type="number" name={maxName} defaultValue={max} key={max} step={step} className="w-full p-2 border border-gray-300 rounded-md" />
      </div>
    </div>
  </div>
);
