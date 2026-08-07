import React, { useState, useEffect } from 'react';
import { Search, FileText, ChevronRight, ChevronDown, Clock, Phone } from 'lucide-react';
import { PageContent } from '../types';

interface PublicService {
  id: number;
  name: string;
  description: string;
  icon_url: string;
}

const PublicServicePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<PublicService[]>([]);
  const [content, setContent] = useState<PageContent>({});
  const [loading, setLoading] = useState(true);
  const [expandedServiceId, setExpandedServiceId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedServiceId(prev => prev === id ? null : id);
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/services.php').then(res => res.json()),
      fetch('/api/get_content.php').then(res => res.json())
    ])
      .then(([servicesData, contentData]) => {
        setServices(servicesData);
        setContent(contentData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Service Info Card */}
        {(content.service_hours || content.service_contact) && (
          <div className="bg-white rounded-xl shadow-sm border border-brand-blue/20 p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {content.service_hours && (
              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-lg mr-4 text-brand-blue">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Jam Buka Layanan</h3>
                  <div className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">
                    {content.service_hours}
                  </div>
                </div>
              </div>
            )}
            {content.service_contact && (
              <div className="flex items-start md:border-l border-gray-200 md:pl-8">
                <div className="bg-green-50 p-3 rounded-lg mr-4 text-green-600">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Narahubung / Kontak</h3>
                  <div className="text-gray-600 text-sm">
                    {content.service_contact}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {loading ? (
           <div className="text-center text-gray-500 py-10">Memuat layanan...</div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Layanan tidak ditemukan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const isExpanded = expandedServiceId === service.id;
              return (
                <div 
                  key={service.id} 
                  className={`bg-white rounded-lg shadow-md border ${isExpanded ? 'border-brand-blue ring-1 ring-brand-blue/30' : 'border-gray-100'} hover:shadow-lg transition-all`}
                >
                  <div 
                    className="p-6 cursor-pointer flex items-start justify-between group"
                    onClick={() => toggleExpand(service.id)}
                  >
                    <div className="flex items-center">
                      {service.icon_url ? (
                        <img src={service.icon_url} alt={service.name} className="h-12 w-12 object-contain mr-4 bg-blue-50 p-2 rounded-lg flex-shrink-0" />
                      ) : (
                        <div className="bg-blue-50 p-3 rounded-lg text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors flex-shrink-0 mr-4">
                          <FileText className="h-6 w-6" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-brand-blue transition-colors leading-tight">
                          {service.name}
                        </h3>
                        {!isExpanded && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">Lihat detail persyaratan & prosedur...</p>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 mt-2">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-brand-blue" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-brand-blue transition-colors" />
                      )}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
                      <div className="prose prose-sm prose-blue max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: service.description }} />
                      <div className="mt-6 flex justify-end">
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleExpand(service.id); }}
                          className="text-sm font-medium text-brand-blue hover:text-brand-lightblue flex items-center"
                        >
                          Sembunyikan detail <ChevronDown className="h-4 w-4 ml-1 transform rotate-180" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicServicePage;
