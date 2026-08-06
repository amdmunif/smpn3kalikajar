
import React from 'react';
import { GALLERY_ITEMS } from '../constants';

const PageHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="bg-brand-blue text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-4 text-lg text-gray-300">{subtitle}</p>
    </div>
  </div>
);

const GalleryPage: React.FC = () => {
  return (
    <div className="bg-white">
      <PageHeader title="Galeri Foto" subtitle="Momen berharga dari kegiatan dan fasilitas sekolah kami" />

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {GALLERY_ITEMS.map((item) => (
            <div key={item.id} className="group relative">
              <img
                src={item.imageUrl}
                alt={item.caption}
                className="w-full h-72 object-cover rounded-lg shadow-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end p-4 rounded-lg">
                <p className="text-white text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
