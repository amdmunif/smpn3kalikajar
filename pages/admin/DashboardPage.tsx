import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, FileText, Image as ImageIcon, Briefcase, TrendingUp, Calendar, MousePointerClick } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  // Dummy data for charts to make it look premium
  const visitorData = [
    { name: 'Senin', visitors: 400 },
    { name: 'Selasa', visitors: 300 },
    { name: 'Rabu', visitors: 550 },
    { name: 'Kamis', visitors: 480 },
    { name: 'Jumat', visitors: 700 },
    { name: 'Sabtu', visitors: 850 },
    { name: 'Minggu', visitors: 920 },
  ];

  const contentStats = [
    { name: 'Berita', total: 45 },
    { name: 'Pengumuman', total: 12 },
    { name: 'Prestasi', total: 28 },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Selamat datang kembali, {user?.name}!</p>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-brand-blue/30 transition-colors">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Guru</p>
            <h3 className="text-3xl font-bold text-gray-900">42</h3>
          </div>
          <div className="h-14 w-14 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center">
            <Users className="h-7 w-7" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-amber-500/30 transition-colors">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Berita</p>
            <h3 className="text-3xl font-bold text-gray-900">85</h3>
          </div>
          <div className="h-14 w-14 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
            <FileText className="h-7 w-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-emerald-500/30 transition-colors">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Galeri Foto</p>
            <h3 className="text-3xl font-bold text-gray-900">124</h3>
          </div>
          <div className="h-14 w-14 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
            <ImageIcon className="h-7 w-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-purple-500/30 transition-colors">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Layanan Publik</p>
            <h3 className="text-3xl font-bold text-gray-900">8</h3>
          </div>
          <div className="h-14 w-14 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
            <Briefcase className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart: Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-brand-blue" />
                Statistik Pengunjung Website
              </h2>
              <p className="text-sm text-gray-500 mt-1">Lalu lintas pengunjung 7 hari terakhir (Ilustrasi)</p>
            </div>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:ring-brand-blue focus:border-brand-blue outline-none">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D47A1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0D47A1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#0D47A1', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="visitors" stroke="#0D47A1" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart: Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <MousePointerClick className="h-5 w-5 mr-2 text-amber-500" />
              Distribusi Konten
            </h2>
            <p className="text-sm text-gray-500 mt-1">Berdasarkan kategori artikel</p>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="total" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Agenda Terdekat</p>
                <p className="text-xs text-gray-500 mt-1">Ujian Tengah Semester - 15 Oktober 2026</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
