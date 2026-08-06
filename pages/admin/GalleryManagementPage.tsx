import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Image as ImageIcon } from 'lucide-react';

interface GalleryItem {
  id: number;
  image_url: string;
  caption: string;
}

const GalleryManagementPage: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<GalleryItem, 'id'>>({ image_url: '', caption: '' });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/gallery.php');
      const data = await response.json();
      setGallery(data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const handleOpenModal = () => {
    setFormData({ image_url: '', caption: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/gallery.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        alert('Gambar berhasil ditambahkan ke galeri!');
        fetchGallery();
      } else {
        alert('Gagal: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving gallery:', error);
      alert('Terjadi kesalahan saat menyimpan data.');
    }
    handleCloseModal();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus gambar ini dari galeri?')) {
      try {
        const response = await fetch(`/api/gallery.php?id=${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
          alert('Gambar berhasil dihapus!');
          fetchGallery();
        } else {
          alert('Gagal: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting gallery item:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Galeri Sekolah</h1>
        <button onClick={handleOpenModal} className="flex items-center bg-brand-blue text-white py-2 px-4 rounded-md hover:bg-brand-lightblue transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          Tambah Gambar
        </button>
      </div>

      {gallery.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-lg shadow-md text-gray-500">
          Belum ada foto di galeri. Silakan tambah gambar baru.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gallery.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
              <div className="aspect-w-16 aspect-h-12 relative overflow-hidden bg-gray-100">
                <img src={item.image_url} alt={item.caption} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button onClick={() => handleDelete(item.id)} className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transform hover:scale-110 transition-transform shadow-lg" title="Hapus Gambar">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.caption || 'Tanpa Keterangan'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">Upload ke Galeri</h2>
              <button onClick={handleCloseModal} className="p-2 rounded-full hover:bg-gray-200">
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">URL Gambar</label>
                <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} required placeholder="https://contoh.com/foto.jpg" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" />
                <p className="text-xs text-gray-500 mt-1">Masukkan link gambar (JPG/PNG).</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Keterangan / Caption</label>
                <input type="text" name="caption" value={formData.caption} onChange={handleChange} required placeholder="Contoh: Upacara Kemerdekaan RI" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" />
              </div>

              {formData.image_url && (
                <div className="mt-4 border rounded-md p-2 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-2">Pratinjau Gambar:</p>
                  <img src={formData.image_url} alt="Pratinjau" className="max-h-48 w-auto mx-auto rounded" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Gambar+Tidak+Valid')} />
                </div>
              )}

              <div className="mt-8 flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300">Batal</button>
                <button type="submit" className="bg-brand-blue text-white py-2 px-4 rounded-md hover:bg-brand-lightblue">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagementPage;
