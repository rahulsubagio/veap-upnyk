import { LoaderCircle } from 'lucide-react';

export default function Loading() {

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="flex items-center gap-4">
        <LoaderCircle className="h-8 w-8 animate-spin text-blue-900" />
        <div>
          <p className="text-xl font-semibold text-gray-800">Dashboard Loading...</p>
          <p className="text-gray-500">Mohon tunggu sebentar, kami sedang menyiapkan data Anda.</p>
        </div>
      </div>
    </div>
  );
}
