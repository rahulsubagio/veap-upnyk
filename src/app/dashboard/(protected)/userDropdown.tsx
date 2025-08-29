"use client";

import { useState, useEffect, useRef } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';
import { logout } from '@veap/app/login/actions';
import { useUser } from '@veap/app/components/UserProvider';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, profile, isLoading } = useUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayRole = profile?.role
    ? profile.role.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())
    : 'Loading...';

  const userEmail = user?.email;

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} disabled={isLoading} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none">
        <span>{displayRole}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Konten Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg border-1">
          <div className="py-1">
            <div className="px-4 py-3">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="truncate text-sm font-medium text-gray-800" title={userEmail}>
                {userEmail || 'No email available'}
              </p>
            </div>
            <div className="border-t border-gray-100"></div>
            <form action={logout} className="w-full">
              <button type="submit" className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
