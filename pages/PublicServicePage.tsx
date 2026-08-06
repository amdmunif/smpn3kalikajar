import React, { useState } from 'react';
import { Search, FileText, ChevronRight } from 'lucide-react';

const publicServicesList = [
  "Penerimaan Peserta Didik Baru (PPDB)",
  "Mutasi Masuk Siswa",
  "Mutasi Keluar Siswa",
  "Legalisir Ijazah",
  "Legalisir Rapor",
  "Surat Keterangan Lulus (SKL)",
  "Surat Keterangan Pengganti Ijazah",
  "Surat Keterangan Aktif Belajar",
  "Surat Keterangan Berkelakuan Baik",
  "Surat Rekomendasi Beasiswa",
  "Layanan Bimbingan Konseling",
  "Peminjaman Fasilitas Sekolah",
  "Pendaftaran Ekstrakurikuler",
  "Layanan Perpustakaan",
  "Pengaduan & Saran",
  "Informasi Pembayaran/Tunggakan",
  "Permintaan Transkrip Nilai",
  "Penerbitan Kartu Pelajar"
];

const PublicServicePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = publicServicesList.filter(service => 
    service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-brand-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Layanan Publik Internal</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-200">
            Daftar 18 Layanan Administrasi dan Akademik SMP Negeri 3 Kalikajar.
          </p>
          <div className="mt-8 max-w-md mx-auto relative text-gray-900">
            <input 
              type="text" 
              placeholder="Cari layanan..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {filteredServices.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Layanan tidak ditemukan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg hover:border-brand-lightblue transition-all cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-3 rounded-lg text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="ml-4 text-lg font-semibold text-gray-800 group-hover:text-brand-blue transition-colors">
                      {service}
                    </h3>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-brand-blue transition-colors mt-2" />
                </div>
                <div className="mt-4 text-sm text-gray-500 line-clamp-2">
                  Klik untuk melihat detail persyaratan, alur, dan formulir pengajuan untuk {service}. (Segera Hadir)
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicServicePage;
