"use client";

import { Dock, DockIcon } from "@veap/components/magicui/dock";
import { Home, SlidersHorizontal, Database } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type DockNavigationProps = {
  role: 'super_admin' | 'admin' | 'guest';
};

export function DockNavigation({ role }: DockNavigationProps) {
  const router = useRouter();

  // Buat variabel boolean untuk mempermudah pengecekan
  const isGuest = role === 'guest';

  return (
    <div className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20">
      <Dock direction="middle" className="rounded-full bg-white">
        <DockIcon className="bg-gray-200" onClick={() => router.push('/dashboard/indoor-hydroponic')}>
          <Home className="h-5 w-5" />
        </DockIcon>

        {!isGuest && (
          <DockIcon className="bg-gray-200" onClick={() => router.push('/dashboard/indoor-hydroponic/settings')}>
            <SlidersHorizontal className="h-5 w-5" />
          </DockIcon>
        )}
        
        {!isGuest && (
          <DockIcon className="bg-gray-200" onClick={() => router.push('/dashboard/indoor-hydroponic/data')}>
            <Database className="h-5 w-5" />
          </DockIcon>
        )}
      </Dock>
    </div>
  );
}