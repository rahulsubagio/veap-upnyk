'use client';
import { useEffect, useState } from 'react';
import client from '@veap/lib/mqttClient';

export default function Dashboard() {
  const [suhu, setSuhu] = useState<number | null>(null);
  const [kelembapan, setKelembapan] = useState<number | null>(null);

  useEffect(() => {
    client.on('connect', () => {
      console.log('🟢 Web terhubung ke MQTT broker!');
      client.subscribe('home/suhu');
    });

    client.on('message', (topic, message) => {
      if (topic === 'home/suhu') {
        try {
          const data = JSON.parse(message.toString());
          setSuhu(data.suhu);
          setKelembapan(data.humidity);
        } catch (error) {
          console.error('⚠️ Gagal parsing JSON dari MQTT:', error);
        }
      }
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Dashboard Monitoring Suhu</h1>
      <p className="text-xl mb-2">🌡️ Suhu: {suhu !== null ? `${suhu}°C` : 'Loading...'}</p>
      <p className="text-xl">💧 Kelembapan: {kelembapan !== null ? `${kelembapan}%` : 'Loading...'}</p>
    </main>
  );
}
