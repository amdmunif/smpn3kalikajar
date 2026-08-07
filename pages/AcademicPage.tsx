import React, { useState, useEffect } from 'react';
import { GraduationCap, ArrowRight, Loader, Search } from 'lucide-react';

interface AcademicService {
  id: number;
  name: string;
  url: string;
  icon_url: string;
}

const PageHeader: React.FC<{ title: string; subtitle: string; searchTerm: string; onSearch: (term: string) => void }> = ({ title, subtitle, searchTerm, onSearch }) => (
  <div className="bg-brand-blue text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">{subtitle}</p>
      <div className="mt-8 max-w-md mx-auto relative text-gray-900">
        <input 
          type="text" 
          placeholder="Cari layanan akademik..." 
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary"
        />
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
      </div>
    </div>
  </div>
);

const AcademicPage: React.FC = () => {
  const [services, setServices] = useState<AcademicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/academic_services.php');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching academic services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center">
        <Loader className="h-10 w-10 text-brand-blue animate-spin mb-4" />
        <p className="text-gray-500">Memuat layanan akademik...</p>
      </div>
    );
  }

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    service.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <PageHeader 
        title="Layanan Akademik" 
        subtitle="Berbagai layanan seputar kegiatan belajar mengajar dan kesiswaan untuk memfasilitasi kebutuhan siswa dan wali murid." 
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
      />



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <GraduationCap className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-xl font-bold text-gray-900">
              {services.length === 0 ? "Belum ada layanan akademik" : "Layanan tidak ditemukan"}
            </h3>
            <p className="mt-2 text-gray-500">
              {services.length === 0 ? "Daftar layanan akademik belum ditambahkan oleh administrator." : "Coba gunakan kata kunci pencarian yang lain."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map(service => (
              <a 
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                key={service.id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col"
              >
                <div className="p-8 flex-grow">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-brand-blue group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 shadow-sm border border-blue-100">
                    {service.icon_url ? (
                      <img src={service.icon_url} alt={service.name} className="w-10 h-10 object-contain drop-shadow-sm filter group-hover:brightness-0 group-hover:invert" />
                    ) : (
                      <GraduationCap className="w-8 h-8" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-blue transition-colors">{service.name}</h3>
                  <p className="text-gray-500 text-sm break-all">{service.url}</p>
                </div>
                
                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 mt-auto flex items-center text-sm font-semibold text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors cursor-pointer">
                  Masuk Layanan
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicPage;
