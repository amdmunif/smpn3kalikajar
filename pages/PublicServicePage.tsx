import React, { useState, useEffect } from 'react';
import { Search, FileText, ChevronRight } from 'lucide-react';

interface PublicService {
  id: number;
  name: string;
  description: string;
  icon_url: string;
}

const PublicServicePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services.php')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching services:', err);
        setLoading(false);
      });
  }, []);

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-brand-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Layanan Publik Internal</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-200">
            Daftar Layanan Administrasi dan Akademik SMP Negeri 3 Kalikajar.
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
        {loading ? (
           <div className="text-center text-gray-500 py-10">Memuat layanan...</div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Layanan tidak ditemukan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg hover:border-brand-lightblue transition-all cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {service.icon_url ? (
                      <img src={service.icon_url} alt={service.name} className="h-12 w-12 object-contain mr-4 bg-blue-50 p-2 rounded-lg" />
                    ) : (
                      <div className="bg-blue-50 p-3 rounded-lg text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                        <FileText className="h-6 w-6" />
                      </div>
                    )}
                    <h3 className="ml-4 text-lg font-semibold text-gray-800 group-hover:text-brand-blue transition-colors">
                      {service.name}
                    </h3>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-brand-blue transition-colors mt-2" />
                </div>
                <div className="mt-4 text-sm text-gray-500 line-clamp-2">
                  {service.description || `Klik untuk melihat detail persyaratan, alur, dan formulir pengajuan untuk ${service.name}.`}
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
