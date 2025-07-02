// src/app/dashboard/(protected)/smartdec/kalibrasi/components/CalibrationClient.tsx
"use client";

import { useEffect, useState } from 'react';
import client from '@veap/lib/mqttClient'; // Pastikan path ini sesuai
import { TestTube, Droplets, Thermometer, AlertTriangle, CheckCircle, Save, RefreshCw, Waves } from 'lucide-react';

// Tipe untuk menyimpan nilai kalibrasi
interface CalibrationSettings {
  tdsFactor?: number;
  voltage_pH7?: number;
  voltage_pH4?: number;
  tempOffset?: number;
  soilMoistureAir?: number;
  soilMoistureWater?: number;
}

export default function CalibrationClient() {
  const [statusMessage, setStatusMessage] = useState("Click 'Refresh' to get current device settings.");
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');
  const [isBusy, setIsBusy] = useState(false);
  const [settings, setSettings] = useState<CalibrationSettings>({});

  const sendCommand = (command: string, value?: number) => {
    if (!client.connected) {
      setStatusMessage("MQTT not connected. Cannot send command.");
      setMessageType('error');
      return;
    }

    const payload = value !== undefined ? { command, value } : { command };
    const topic = "smartdec/calibrate/command";

    setIsBusy(true);
    setStatusMessage(`Sending command: ${command}...`);
    setMessageType('info');

    client.publish(topic, JSON.stringify(payload), (err) => {
      if (err) {
        setStatusMessage("Failed to send command.");
        setMessageType('error');
        setIsBusy(false);
      }
    });
  };

  useEffect(() => {
    const handleStatusMessage = (topic: string, message: Buffer) => {
      if (topic === "smartdec/calibrate/status") {
        try {
          const data = JSON.parse(message.toString());
          setStatusMessage(`Device response received. Settings updated.`);
          setMessageType('success');
          setSettings(data); // Update state dengan nilai kalibrasi terbaru dari perangkat
          setIsBusy(false);
        } catch (e) {
          console.error("Invalid status message format:", e);
        }
      }
    };

    client.subscribe("smartdec/calibrate/status");
    client.on("message", handleStatusMessage);

    // Minta pengaturan saat komponen pertama kali dimuat
    sendCommand('get_settings');

    return () => {
      client.unsubscribe("smartdec/calibrate/status");
      client.off("message", handleStatusMessage);
    };
  }, []);

  const statusColors = {
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
  };

  return (
    <div className="space-y-8">
      <div className={`border-l-4 p-4 rounded-r-lg ${statusColors[messageType]}`} role="alert">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {messageType !== 'success' && <AlertTriangle className="h-5 w-5 mr-3" />}
            {messageType === 'success' && <CheckCircle className="h-5 w-5 mr-3" />}
            <div>
              <p className="font-bold">Status</p>
              <p>{statusMessage}</p>
            </div>
          </div>
          <button onClick={() => sendCommand('get_settings')} disabled={isBusy} className="flex items-center gap-2 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
            <RefreshCw className={`h-3 w-3 ${isBusy ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-4"><TestTube className="w-8 h-8 text-green-600" /><h3 className="text-xl font-bold text-gray-800">pH Calibration</h3></div>
          <p className="text-sm text-gray-600">Current Values: pH7 V = {settings.voltage_pH7?.toFixed(3) || 'N/A'}, pH4 V = {settings.voltage_pH4?.toFixed(3) || 'N/A'}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => sendCommand('capture_ph7')} disabled={isBusy} className="flex-1 rounded-lg bg-gray-700 px-4 py-2 text-white font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed">Capture pH 7.0</button>
            <button onClick={() => sendCommand('capture_ph4')} disabled={isBusy} className="flex-1 rounded-lg bg-gray-700 px-4 py-2 text-white font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed">Capture pH 4.0</button>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-4"><Droplets className="w-8 h-8 text-blue-600" /><h3 className="text-xl font-bold text-gray-800">Soil Moisture</h3></div>
          <p className="text-sm text-gray-600">Current Values: Dry = {settings.soilMoistureAir || 'N/A'}, Wet = {settings.soilMoistureWater || 'N/A'}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => sendCommand('capture_sm_air')} disabled={isBusy} className="flex-1 rounded-lg bg-gray-700 px-4 py-2 text-white font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed">Set Dry (0%)</button>
            <button onClick={() => sendCommand('capture_sm_water')} disabled={isBusy} className="flex-1 rounded-lg bg-gray-700 px-4 py-2 text-white font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed">Set Wet (100%)</button>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-4"><Waves className="w-8 h-8 text-cyan-600" /><h3 className="text-xl font-bold text-gray-800">TDS Factor</h3></div>
          <p className="text-sm text-gray-600">Current Value: {settings.tdsFactor?.toFixed(1) || 'N/A'}</p>
          <form onSubmit={(e) => { e.preventDefault(); sendCommand('set_tds', parseFloat(e.currentTarget.tdsValue.value)); }} className="flex gap-4">
            <input name="tdsValue" type="number" step="10" defaultValue={settings.tdsFactor} className="w-full rounded-lg border-gray-300 border-2 px-4 py-2" />
            <button type="submit" disabled={isBusy} className="rounded-lg bg-blue-800 px-6 py-2 text-white font-semibold hover:bg-blue-900 disabled:bg-gray-400">Set</button>
          </form>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-4"><Thermometer className="w-8 h-8 text-amber-600" /><h3 className="text-xl font-bold text-gray-800">Temp. Offset</h3></div>
          <p className="text-sm text-gray-600">Current Value: {settings.tempOffset?.toFixed(2) || 'N/A'}</p>
          <form onSubmit={(e) => { e.preventDefault(); sendCommand('set_temp_offset', parseFloat(e.currentTarget.tempOffsetValue.value)); }} className="flex gap-4">
          <input name="tempOffsetValue" type="number" step="0.1" defaultValue={settings.tempOffset} className="w-full rounded-lg border-gray-300 border-2 px-4 py-2" />
            <button type="submit" disabled={isBusy} className="rounded-lg bg-blue-800 px-6 py-2 text-white font-semibold hover:bg-blue-900 disabled:bg-gray-400">Set</button>
          </form>
        </div>
        
        <div className="rounded-xl border bg-white p-6 shadow-sm md:col-span-2">
          <div className="flex items-center gap-4 mb-4"><Save className="w-8 h-8 text-indigo-600" /><h3 className="text-xl font-bold text-gray-800">Save Settings</h3></div>
          <p className="text-gray-600 mb-4">After all calibrations are set, click here to permanently save all values to the device&apos;s memory.</p>
          <button onClick={() => sendCommand('save')} disabled={isBusy} className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-white font-bold hover:bg-indigo-700 disabled:bg-gray-400">
            Save All Settings to Device
          </button>
        </div>
      </div>
    </div>
  );
}
