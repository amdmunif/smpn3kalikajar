import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import DataTable, { Column } from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';

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
          fetchGallery();
        } else {
          alert('Gagal: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting gallery item:', error);
      }
    }
  };

  const columns: Column<GalleryItem>[] = [
    {
      header: 'Pratinjau Gambar',
      accessor: (item) => (
        <div className="relative group overflow-hidden rounded shadow-sm border border-gray-100 h-16 w-24">
          <img src={item.image_url} alt={item.caption} className="w-full h-full object-cover" />
        </div>
      ),
      className: 'w-32'
    },
    { 
      header: 'Keterangan (Caption)', 
      accessor: (item) => (
        <span className="font-medium text-gray-900">{item.caption || <span className="text-gray-400 italic">Tanpa Keterangan</span>}</span>
      )
    },
    { 
      header: 'URL Gambar', 
      accessor: (item) => (
        <a href={item.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline max-w-xs truncate block" title={item.image_url}>
          {item.image_url}
        </a>
      )
    },
    {
      header: 'Aksi',
      accessor: (item) => (
        <button 
          onClick={() => handleDelete(item.id)} 
          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
          title="Hapus"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
      className: 'w-24 text-center'
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Galeri Sekolah</h1>
          <p className="text-gray-500 mt-1">Kelola album foto kegiatan dan fasilitas</p>
        </div>
        <button 
          onClick={handleOpenModal} 
          className="flex items-center px-5 py-2.5 bg-brand-blue text-white rounded-lg shadow-sm hover:bg-brand-lightblue focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tambah Gambar
        </button>
      </div>

      <DataTable
        columns={columns}
        data={gallery}
        searchPlaceholder="Cari caption atau URL..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Upload ke Galeri"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">URL Gambar</label>
            <input 
              type="url" 
              name="image_url" 
              value={formData.image_url} 
              onChange={handleChange} 
              required 
              placeholder="https://contoh.com/foto.jpg" 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" 
            />
            <p className="text-xs text-gray-500 mt-2">Masukkan link gambar langsung berformat JPG/PNG.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Keterangan / Caption</label>
            <input 
              type="text" 
              name="caption" 
              value={formData.caption} 
              onChange={handleChange} 
              required 
              placeholder="Contoh: Upacara Kemerdekaan RI" 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" 
            />
          </div>

          {formData.image_url && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-lg">
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Pratinjau Gambar</p>
              <div className="flex justify-center">
                <img 
                  src={formData.image_url} 
                  alt="Pratinjau" 
                  className="max-h-48 w-auto rounded shadow-sm border border-gray-200" 
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Gambar+Tidak+Valid')} 
                />
              </div>
            </div>
          )}

          <div className="pt-5 border-t border-gray-100 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={handleCloseModal} 
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-brand-lightblue shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-colors"
            >
              Upload Gambar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GalleryManagementPage;
