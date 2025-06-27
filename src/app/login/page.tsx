"use client";

import type { NextPage } from 'next';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Leaf } from 'lucide-react';
import Link from 'next/link';
import { login } from './actions';
import { AuroraText } from '@veap/components/magicui/aurora-text';

// This component contains the form logic and needs Suspense because of useSearchParams
function LoginComponent() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  // Get the dashboard name from the URL query parameter
  const dashboard = searchParams.get('dashboard') || '';

  const dashboardTitles: { [key: string]: string } = {
      'green-pyramid': 'Green Pyramid',
      'smartdec': 'Smartdec',
      'indoor-hidroponic': 'Indoor Hidroponic'
  };

  // Show an error message if the user accesses /login without a parameter
  if (!dashboard) {
    return (
      <div className="w-full p-8 md:p-12 flex flex-col justify-center items-center text-center">
        <h2 className="text-xl font-bold text-red-600">Error: Dashboard Not Specified</h2>
        <p className="mt-2 text-gray-600">Please select a dashboard system from the portal page.</p>
        <Link href="/dashboard" className="mt-4 bg-blue-900 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-800">
          Go to Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full p-8 md:p-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Login</h1>
        <p className="text-gray-600 mt-2">
          Access the <span className="font-bold text-blue-800"><AuroraText>{dashboardTitles[dashboard]}</AuroraText></span> dashboard.
        </p>
        {searchParams.has('message') && (
          <p className="mt-4 p-4 bg-red-100 text-red-700 border border-red-400 text-center rounded-md">
            {searchParams.get('message')}
          </p>
        )}
      </div>

      <form action={login} className="space-y-6">
        <input type="hidden" name="dashboard" value={dashboard} />
        
        <div className="relative">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Mail className="absolute left-3 top-10 w-5 h-5 text-gray-400" />
          <input type="email" id="email" name="email" placeholder="you@example.com" required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"/>
        </div>

        <div className="relative">
          <div className="flex justify-between items-baseline">
            <label htmlFor="password"className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            {/* <a href="#" className="text-sm text-blue-800 hover:underline">Forgot password?</a> */}
          </div>
          <Lock className="absolute left-3 top-10 w-5 h-5 text-gray-400" />
          <input type={passwordVisible ? "text" : "password"} id="password" name="password" placeholder="Enter your password" required className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"/>
          <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-3 top-9 p-1 text-gray-500 hover:text-gray-700">
            {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        
        <div>
          <button type='submit' className="w-full bg-blue-900 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-800 disabled:bg-blue-400 transition-all duration-300 transform hover:scale-105">
            Login
          </button>
        </div>
      </form>
    </div>
  )
}

// Main page component that wraps the layout and Suspense boundary
const LoginPage: NextPage = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen font-bold text-xl">Loading Page...</div>}>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
          
        {/* Header Logo and Title */}
        <div className="text-center mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-3">
            <Leaf className="sm:w-10 sm:h-10 w-8 h-8 text-blue-900" />
            <span className="sm:text-3xl text-2xl font-bold text-gray-800">IoT Dashboard <AuroraText>Center</AuroraText></span>
          </Link>
        </div>
        
        {/* Login Form Card */}
        <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <LoginComponent />
        </div>

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-blue-800 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </Link>
        </div>

      </div>
    </Suspense>
  );
};

export default LoginPage;