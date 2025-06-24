"use client";

import type { NextPage } from 'next';
import { 
    Sprout, ShieldCheck, Building, ArrowRight, ArrowLeft, Leaf
} from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Interface untuk tipe data properti kartu proyek/dashboard
interface ProjectCardProps {
  imageSrc: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  loginHref: string;
}

// Data untuk tiga pilihan dashboard
const projectData: ProjectCardProps[] = [
  {
    imageSrc: "/images/dash-iot.jpg",
    icon: <Sprout className="h-8 w-8 text-green-700" />,
    title: "Green Pyramid",
    description: "University research greenhouse monitoring for tropical plants and conservation.",
    loginHref: "/login/green-pyramid"
  },
  {
    imageSrc: "/images/dash-iot.jpg",
    icon: <ShieldCheck className="h-8 w-8 text-blue-700" />,
    title: "Smartdec",
    description: "Smart irrigation and nutrient monitoring system for open-field precision agriculture.",
    loginHref: "/login/smartdec"
  },
  {
    imageSrc: "/images/dash-iot.jpg",
    icon: <Building className="h-8 w-8 text-purple-700" />,
    title: "Indoor Hidroponic",
    description: "Micro-environment control for efficient indoor hydroponic vegetable cultivation.",
    loginHref: "/login/indoor-hydroponic"
  },
];

// Komponen Kartu Proyek yang dapat digunakan kembali
const ProjectCard: React.FC<ProjectCardProps> = ({ imageSrc, icon, title, description, loginHref }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group flex flex-col">
      <div className="relative w-full h-48">
        <Image 
          src={imageSrc}
          alt={`[Gambar ilustrasi untuk ${title}]`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 p-3 rounded-lg">
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        </div>
        <p className="mt-4 text-gray-600 flex-grow">{description}</p>
        <a 
          href={loginHref}
          className="mt-6 bg-blue-900 text-white text-center font-semibold py-3 px-6 rounded-lg hover:bg-blue-800 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>Access Dashboard</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};

// Komponen Header untuk Halaman Portal
const PortalHeader: React.FC = () => {
  return (
    <header className="bg-transparent absolute top-0 left-0 right-0 z-10">
      <div className="container mx-auto md:px-20 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <Leaf className="w-7 h-7 sm:w-8 sm:h-8 text-blue-900" />
            <span className="text-xl sm:text-2xl font-bold text-gray-800">IoT Dashboard Center</span>
        </div>
        <Link href="/" className="bg-white text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition duration-300 flex items-center gap-2 border border-gray-200 shadow-sm">
          <ArrowLeft className="w-4 h-4" />
          <span className='hidden md:inline'>Back to Main Site</span>
        </Link>
      </div>
    </header>
  );
};

// Halaman Utama untuk Pemilihan Dashboard
const DashboardPortalPage: NextPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PortalHeader />

      <main className="flex items-center justify-center min-h-screen py-24 px-6">
        <div className="text-center">
          {/* Welcome Message */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Choose Your Dashboard System
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Each system is designed for specific needs. Please select the appropriate dashboard to begin monitoring.
          </p>

          {/* Project Cards Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {projectData.map((data, index) => (
              <ProjectCard key={index} {...data} />
            ))}
          </div>
        </div>
      </main>
      
      <footer className="text-center py-6 text-gray-500 bg-gray-50">
        &copy; {new Date().getFullYear()} IoT Dashboard Center | Veteran Education Agro Park
      </footer>
    </div>
  );
};

export default DashboardPortalPage;
