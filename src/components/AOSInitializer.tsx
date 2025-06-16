// app/components/AOSInitializer.tsx
"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const AOSInitializer = () => {
  useEffect(() => {
    AOS.init({
      // Opsi konfigurasi AOS
      duration: 800,
      once: false, // Apakah animasi hanya terjadi sekali
    });
  }, []); // Array dependensi kosong memastikan ini hanya berjalan sekali

  return null; // Komponen ini tidak me-render UI apa pun
};