'use client';

import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';
import { Save, FlaskConical } from 'lucide-react';

const SettingsClient = () => {
  // --- State Pengaturan ---
  const [ecThreshold, setEcThreshold] = useState('');
  const [lowPhThreshold, setLowPhThreshold] = useState('');
  const [highPhThreshold, setHighPhThreshold] = useState('');
  const [volumeABMix, setVolumeABMix] = useState('');
  const [volumePHUp, setVolumePHUp] = useState('');
  const [volumePHDown, setVolumePHDown] = useState('');
  const [interval_siklusABMix, setInterval_siklusABMix] = useState('');
  const [interval_siklusPHUp, setInterval_siklusPHUp] = useState('');
  const [interval_siklusPHDown, setInterval_siklusPHDown] = useState('');
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [calStatus, setCalStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const [currentPh, setCurrentPh] = useState<number | null>(null);
  const [isSettingsConnected, setIsSettingsConnected] = useState(false);
  
  const dataTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Topik MQTT ---
  const SETTINGS_COMMAND_TOPIC = 'hidroponicKloning/control/settings/command';
  const CALIBRATE_COMMAND_TOPIC = 'hidroponicKloning/ph/calibrate/command';
  const SENSOR_DATA_TOPIC = 'hidroponicKloning/sensors/data';
  const SETTINGS_STATUS_TOPIC = 'hidroponicKloning/control/settings/status';
  const SETTINGS_GET_TOPIC = 'hidroponicKloning/control/settings/get';

  useEffect(() => {
    const brokerUrl = 'wss://veap-upnyk.id/mqtt';
    const mqttClient = mqtt.connect(brokerUrl);
    setClient(mqttClient);

    mqttClient.on('connect', () => {
      setIsSettingsConnected(true);
      mqttClient.subscribe(SENSOR_DATA_TOPIC);
      mqttClient.subscribe(SETTINGS_STATUS_TOPIC);
      mqttClient.publish(SETTINGS_GET_TOPIC, "get");
    });

    mqttClient.on('message', (topic, message) => {
      const payload = message.toString();
      if (topic === SENSOR_DATA_TOPIC) {
        if (dataTimeoutRef.current) {
          clearTimeout(dataTimeoutRef.current);
        }
        dataTimeoutRef.current = setTimeout(() => {
          console.warn("Tidak ada data sensor diterima di halaman Settings selama 5 detik. Mereset pH.");
          setCurrentPh(null);
        }, 3000);

        try {
          const data = JSON.parse(payload);
          if (data.ph !== undefined) {
            setCurrentPh(data.ph);
          }
        } catch (e) {
          console.error("Gagal parse data sensor di halaman settings:", e);
        }
      }
      else if (topic === SETTINGS_STATUS_TOPIC) {
        try {
          const settings = JSON.parse(payload);
          
          setEcThreshold(settings.ec_threshold?.toString() ?? '');
          setLowPhThreshold(settings.lowph_threshold?.toString() ?? '');
          setHighPhThreshold(settings.highph_threshold?.toString() ?? '');
          setVolumeABMix(settings.volume_ABMix?.toString() ?? '');
          setVolumePHUp(settings.volume_PHUp?.toString() ?? '');
          setVolumePHDown(settings.volume_PHDown?.toString() ?? '');
          setInterval_siklusABMix(settings.interval_ABMix?.toString() ?? '');
          setInterval_siklusPHUp(settings.interval_PHUp?.toString() ?? '');
          setInterval_siklusPHDown(settings.interval_PHDown?.toString() ?? '');

          console.log("Pengaturan diterima dari ESP32:", settings);
        } catch(e) {
          console.error("Gagal parse data pengaturan:", e);
        }
      }
    });

    mqttClient.on('error', (err: Error) => console.error("MQTT Error di halaman settings:", err));
    
    mqttClient.on('close', () => {
      setIsSettingsConnected(false);
      setCurrentPh(null);
      if (dataTimeoutRef.current) {
        clearTimeout(dataTimeoutRef.current);
      }
    });

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

  const handleSaveSettings = () => {
    if (client && client.connected) {
      setSaveStatus('saving');
      const settingsPayload = {
        ec_threshold: parseInt(ecThreshold, 10),
        lowph_threshold: parseFloat(lowPhThreshold),
        highph_threshold: parseFloat(highPhThreshold),
        volume_ABMix: parseInt(volumeABMix, 10),
        volume_PHUp: parseInt(volumePHUp, 10),
        volume_PHDown: parseInt(volumePHDown, 10),
        interval_ABMix: parseInt(interval_siklusABMix, 10),
        interval_PHUp: parseInt(interval_siklusPHUp, 10),
        interval_PHDown: parseInt(interval_siklusPHDown, 10),
      };

      client.publish(SETTINGS_COMMAND_TOPIC, JSON.stringify(settingsPayload), (err) => {
        if (err) {
          setSaveStatus('error');
        } else {
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 3000);
        }
      });
    } else {
      setSaveStatus('error');
    }
  };

  const handleCalibrate = (command: 'CAL_PH7' | 'CAL_PH4' | 'CAL_SAVE') => {
    if (client && client.connected) {
      setCalStatus('saving');
      client.publish(CALIBRATE_COMMAND_TOPIC, command, (err) => {
        if (err) {
          setCalStatus('error');
        } else {
          setCalStatus('saved');
          setTimeout(() => setCalStatus('idle'), 3000);
        }
      });
    } else {
      setCalStatus('error');
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4 mb-18">
      {/* Kolom Pengaturan Otomatis */}
      <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-cyan-600 mb-6">Pengaturan Mode Otomatis</h2>
          
          <div className="space-y-6">
            {/* Ambang Batas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pengaturan Nutrisi</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="ec" className="block text-sm font-medium text-gray-700 mb-2">Ambang Batas EC (uS/cm)</label>
                    <input type="number" id="ec" value={ecThreshold} onChange={(e) => setEcThreshold(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500" />
                    <p className="text-xs text-gray-500 mt-1">Pompa nutrisi akan menyala jika EC di bawah nilai ini.</p>
                </div>
                <div>
                    <label htmlFor="ec" className="block text-sm font-medium text-gray-700 mb-2">Output (ml)</label>
                    <input type="number" id="ec" value={volumeABMix} onChange={(e) => setVolumeABMix(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500" />
                    <p className="text-xs text-gray-500 mt-1">Output nutrisi per mili liter (ml).</p>
                </div>
                <div>
                    <label htmlFor="ec" className="block text-sm font-medium text-gray-700 mb-2">Durasi Interval (ms)</label>
                    <input type="number" id="ec" value={interval_siklusABMix} onChange={(e) => setInterval_siklusABMix(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500" />
                    <p className="text-xs text-gray-500 mt-1">Durasi interval / jeda per mili second (ms).</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pengaturan pH</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="lowph" className="block text-sm font-medium text-gray-700 mb-2">Ambang Batas pH Rendah</label>
                    <input type="number" step="0.1" id="lowph" value={lowPhThreshold} onChange={(e) => setLowPhThreshold(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500" />
                    <p className="text-xs text-gray-500 mt-1">Pompa pH Up akan nyala.</p>
                </div>
                <div>
                    <label htmlFor="tds" className="block text-sm font-medium text-gray-700 mb-2">Output (ml)</label>
                    <input type="number" id="tds" value={volumePHUp} onChange={(e) => setVolumePHUp(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500" />
                    <p className="text-xs text-gray-500 mt-1">Output nutrisi per mili liter (ml).</p>
                </div>
                <div>
                    <label htmlFor="tds" className="block text-sm font-medium text-gray-700 mb-2">Durasi Interval (ms)</label>
                    <input type="number" id="tds" value={interval_siklusPHUp} onChange={(e) => setInterval_siklusPHUp(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500" />
                    <p className="text-xs text-gray-500 mt-1">Durasi interval / jeda per mili second (ms).</p>
                </div>
              </div>

              <div className="grid grid-cols-1 mt-6 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="highph" className="block text-sm font-medium text-gray-700 mb-2">Ambang Batas pH Tinggi</label>
                    <input type="number" step="0.1" id="highph" value={highPhThreshold} onChange={(e) => setHighPhThreshold(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500" />
                    <p className="text-xs text-gray-500 mt-1">Pompa pH Down akan nyala.</p>
                </div>
                <div>
                    <label htmlFor="tds" className="block text-sm font-medium text-gray-700 mb-2">Output (ml)</label>
                    <input type="number" id="tds" value={volumePHDown} onChange={(e) => setVolumePHDown(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500" />
                    <p className="text-xs text-gray-500 mt-1">Output nutrisi per mili liter (ml).</p>
                </div>
                <div>
                    <label htmlFor="tds" className="block text-sm font-medium text-gray-700 mb-2">Durasi Interval (ms)</label>
                    <input type="number" id="tds" value={interval_siklusPHDown} onChange={(e) => setInterval_siklusPHDown(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500" />
                    <p className="text-xs text-gray-500 mt-1">Durasi interval / jeda per mili second (ms).</p>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-8 text-right">
              <button onClick={handleSaveSettings} disabled={saveStatus === 'saving'} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-gray-400">
                  <Save className="w-5 h-5 mr-2" />
                  {saveStatus === 'saving' ? 'Menyimpan...' : saveStatus === 'saved' ? 'Tersimpan!' : 'Simpan Pengaturan'}
              </button>
          </div>
      </div>

      {/* Kolom Kalibrasi pH */}
      <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-green-600 mb-2">Kalibrasi Sensor pH</h2>
          <div className="mb-4 text-center bg-gray-100 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Pembacaan pH Saat Ini</p>
            <p className={`text-4xl font-bold ${isSettingsConnected ? 'text-green-600' : 'text-gray-400'}`}>
              {isSettingsConnected && currentPh !== null ? currentPh.toFixed(2) : '...'}
            </p>
          </div>
          <div className="space-y-4 text-gray-600">
            <p>Untuk akurasi, kalibrasi sensor pH secara berkala. Ikuti langkah-langkah berikut:</p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>Siapkan larutan buffer pH 7.0 dan pH 4.0.</li>
              <li>Celupkan sensor ke larutan buffer, tunggu hingga pembacaan stabil.</li>
              <li>Klik tombol kalibrasi yang sesuai.</li>
              <li>Setelah kedua titik dikalibrasi, klik (Simpan Kalibrasi).</li>
            </ol>
          </div>
          <div className="mt-6 space-y-4">
            <button onClick={() => handleCalibrate('CAL_PH7')} className="w-full flex items-center justify-center space-x-3 py-3 rounded-lg text-white font-semibold transition-colors bg-blue-600 hover:bg-blue-700">
              <FlaskConical /><span>Kalibrasi Titik Tengah (pH 7.0)</span>
            </button>
            <button onClick={() => handleCalibrate('CAL_PH4')} className="w-full flex items-center justify-center space-x-3 py-3 rounded-lg text-white font-semibold transition-colors bg-orange-600 hover:bg-orange-700">
              <FlaskConical /><span>Kalibrasi Titik Asam (pH 4.0)</span>
            </button>
          </div>
          <div className="mt-8 text-right">
              <button onClick={() => handleCalibrate('CAL_SAVE')} disabled={calStatus === 'saving'} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
                  <Save className="w-5 h-5 mr-2" />
                  {calStatus === 'saving' ? 'Menyimpan...' : calStatus === 'saved' ? 'Tersimpan!' : 'Simpan Kalibrasi'}
              </button>
          </div>
      </div>
    </div>
  );
}

export default SettingsClient;