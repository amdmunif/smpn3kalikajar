import React from 'react';
import { BarChart2, HardHat } from 'lucide-react';

const GradeManagementPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manajemen Nilai Siswa</h1>
      
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="flex justify-center mb-4">
            <div className="p-4 bg-yellow-100 rounded-full">
                <HardHat className="h-12 w-12 text-yellow-500" />
            </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Fitur Sedang Dalam Pengembangan</h2>
        <p className="mt-2 text-gray-600">
          Halaman untuk mengelola nilai siswa akan segera tersedia. Kami sedang bekerja keras untuk menyiapkannya.
        </p>
      </div>
    </div>
  );
};

export default GradeManagementPage;
