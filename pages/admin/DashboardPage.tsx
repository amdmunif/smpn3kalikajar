import React from 'react';
import { Users, UserCog, Newspaper, Building2 } from 'lucide-react';
import { STUDENTS, TEACHERS, NEWS_ARTICLES, FACILITIES } from '../../constants';

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Siswa" value={STUDENTS.length} icon={Users} color="bg-blue-500" />
        <StatCard title="Total Guru" value={TEACHERS.length} icon={UserCog} color="bg-green-500" />
        <StatCard title="Total Berita" value={NEWS_ARTICLES.length} icon={Newspaper} color="bg-yellow-500" />
        <StatCard title="Total Fasilitas" value={FACILITIES.length} icon={Building2} color="bg-purple-500" />
      </div>

      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Selamat Datang, Admin!</h2>
        <p className="text-gray-600">
          Anda berada di Panel Admin SMP Negeri 3 Kalikajar. Gunakan menu di sebelah kiri untuk mengelola konten website, data siswa, guru, dan informasi sekolah lainnya. Pastikan untuk selalu menjaga kerahasiaan dan keamanan data.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
