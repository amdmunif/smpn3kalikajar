import React, { useState, useEffect } from 'react';

interface GalleryItem {
  id: number;
  image_url: string;
  caption: string;
}

const PageHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="bg-brand-blue text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-4 text-lg text-gray-300">{subtitle}</p>
    </div>
  </div>
);

const GalleryPage: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gallery.php')
      .then(res => res.json())
      .then(data => {
        setGallery(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching gallery:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white">
      <PageHeader title="Galeri Foto" subtitle="Momen berharga dari kegiatan dan fasilitas sekolah kami" />

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Memuat galeri...</div>
        ) : gallery.length === 0 ? (
           <div className="text-center text-gray-500 py-10">Belum ada foto yang dipublikasikan.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((item) => (
              <div key={item.id} className="group relative">
                <img
                  src={item.image_url}
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
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
