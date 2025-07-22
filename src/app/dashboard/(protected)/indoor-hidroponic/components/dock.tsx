"use client";

import { Dock, DockIcon } from "@veap/components/magicui/dock";
import { Home, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export function DockNavigation() {
  const router = useRouter();

  return (
    <div className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20">
      <Dock direction="middle" className="rounded-full bg-white">
        <DockIcon className="bg-gray-200" onClick={() => router.push('/dashboard/indoor-hidroponic')}>
          <Home className="h-5 w-5" />
        </DockIcon>
        <DockIcon className="bg-gray-200" onClick={() => router.push('/dashboard/indoor-hidroponic/settings')}>
          <SlidersHorizontal className="h-5 w-5" />
        </DockIcon>
      </Dock>
    </div>
  );
}