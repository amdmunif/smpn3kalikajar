import React, { useState, useEffect } from 'react';
import { Eye, Target, BookOpen, Building, Loader } from 'lucide-react';
import { PageContent } from '../types';

const PageHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="bg-brand-blue text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-4 text-lg text-gray-300">{subtitle}</p>
    </div>
  </div>
);

const ProfilePage: React.FC = () => {
  const [content, setContent] = useState<PageContent>({});
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/get_content.php').then(res => res.json()),
      fetch('/api/facilities.php').then(res => res.json())
    ])
      .then(([contentData, facilitiesData]) => {
        setContent(contentData);
        setFacilities(facilitiesData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center">
        <Loader className="h-10 w-10 text-brand-blue animate-spin mb-4" />
        <p className="text-gray-500">Memuat profil sekolah...</p>
      </div>
    );
  }

  const missionList = (content.mission || '').split('\n').filter(m => m.trim().length > 0);

  return (
    <div className="bg-white">
      <PageHeader title="Profil Sekolah" subtitle="Mengenal Lebih Dekat SMP Negeri 3 Kalikajar" />

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Visi & Misi Section */}
        <section>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center text-brand-blue mb-4">
                <Eye className="h-8 w-8 mr-3" />
                <h2 className="text-3xl font-bold">Visi Kami</h2>
              </div>
              <p className="text-xl text-gray-700 italic">"{content.vision || 'Visi belum ditentukan'}"</p>
            </div>
            <div>
              <div className="flex items-center text-brand-blue mb-4">
                <Target className="h-8 w-8 mr-3" />
                <h2 className="text-3xl font-bold">Misi Kami</h2>
              </div>
              <ul className="space-y-3 text-gray-600">
                {missionList.length > 0 ? missionList.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-brand-secondary font-bold mr-3">✔</span>
                    <span>{item}</span>
                  </li>
                )) : (
                  <li className="text-gray-500">Misi belum ditentukan</li>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* Sejarah Section */}
        <section className="bg-brand-background rounded-lg p-8 lg:p-12">
           <div className="flex items-center text-brand-blue mb-4">
              <BookOpen className="h-8 w-8 mr-3" />
              <h2 className="text-3xl font-bold">Profil & Lingkungan Sekolah</h2>
            </div>
            <div className="text-gray-600 leading-relaxed text-justify whitespace-pre-wrap">
                {content.history || 'Sejarah profil belum ditulis.'}
            </div>
        </section>

        {/* Fasilitas Section */}
        <section>
            <div className="flex items-center text-brand-blue mb-8 justify-center">
              <Building className="h-10 w-10 mr-4" />
              <h2 className="text-3xl font-bold text-center">Fasilitas Sekolah</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {facilities.map((facility) => (
                <div key={facility.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 group">
                  {facility.image_url ? (
                    <div className="h-48 overflow-hidden">
                      <img src={facility.image_url} alt={facility.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      <Building className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg">{facility.name}</h3>
                    {facility.description && (
                       <p className="text-gray-600 text-sm mt-2 line-clamp-3">{facility.description}</p>
                    )}
                  </div>
                </div>
              ))}
              {facilities.length === 0 && (
                <div className="col-span-full py-8 text-center text-gray-500">Belum ada fasilitas yang ditambahkan.</div>
              )}
            </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;