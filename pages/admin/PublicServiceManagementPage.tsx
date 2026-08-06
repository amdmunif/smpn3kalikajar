import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Briefcase, Upload, X, Loader } from 'lucide-react';
import DataTable, { Column } from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';

interface PublicService {
  id: number;
  name: string;
  description: string;
  icon_url: string;
}

const PublicServiceManagementPage: React.FC = () => {
  const [services, setServices] = useState<PublicService[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<PublicService, 'id'>>({ name: '', description: '', icon_url: '' });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services.php');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleOpenModal = (service: PublicService | null = null) => {
    setSelectedService(service);
    if (service) {
      setFormData({ name: service.name, description: service.description, icon_url: service.icon_url || '' });
    } else {
      setFormData({ name: '', description: '', icon_url: '' });
    }
    setIsUploading(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const form = new FormData();
    form.append('file', file);

    try {
      const response = await fetch('/api/upload.php', {
        method: 'POST',
        body: form,
      });
      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, icon_url: data.url }));
      } else {
        alert('Upload gagal: ' + data.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Terjadi kesalahan saat upload gambar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/services.php';
      const bodyData = selectedService ? { ...formData, id: selectedService.id } : formData;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      const result = await response.json();
      if (result.success) {
        fetchServices();
      } else {
        alert('Gagal: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Terjadi kesalahan saat menyimpan data.');
    }
    handleCloseModal();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
      try {
        const response = await fetch(`/api/services.php?id=${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
          fetchServices();
        } else {
          alert('Gagal: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const columns: Column<PublicService>[] = [
    {
      header: 'Ikon / Gambar',
      accessor: (item) => item.icon_url ? (
        <img src={item.icon_url} alt={item.name} className="h-10 w-10 object-contain rounded bg-gray-50 p-1 border border-gray-100 shadow-sm" />
      ) : (
        <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-brand-blue shadow-sm">
          <Briefcase className="h-5 w-5" />
        </div>
      ),
      className: 'w-24'
    },
    { 
      header: 'Nama Layanan', 
      accessor: (item) => <span className="font-medium text-gray-900">{item.name}</span>,
      className: 'w-1/3'
    },
    { 
      header: 'Deskripsi', 
      accessor: (item) => <p className="line-clamp-2 max-w-md" title={item.description}>{item.description}</p> 
    },
    {
      header: 'Aksi',
      accessor: (item) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleOpenModal(item)} 
            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(item.id)} 
            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
            title="Hapus"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
      className: 'w-24 text-center'
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Layanan Publik</h1>
          <p className="text-gray-500 mt-1">Kelola daftar layanan akademik dan administrasi sekolah</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center px-5 py-2.5 bg-brand-blue text-white rounded-lg shadow-sm hover:bg-brand-lightblue focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tambah Layanan
        </button>
      </div>

      <DataTable
        columns={columns}
        data={services}
        searchPlaceholder="Cari nama atau deskripsi layanan..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedService ? 'Edit Layanan' : 'Tambah Layanan Baru'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Layanan</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="Contoh: Legalisir Ijazah" 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Singkat</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={4} 
              required 
              placeholder="Syarat dan ketentuan layanan..." 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ikon / Gambar <span className="text-gray-400 font-normal">(Opsional)</span></label>
            <div className="mt-1 flex items-center space-x-4">
              {formData.icon_url ? (
                <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 flex items-center justify-center">
                  <img src={formData.icon_url} alt="Preview" className="h-full w-full object-contain p-2" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon_url: '' }))}
                    className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="h-16 w-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-400">
                  <Briefcase className="h-6 w-6" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-medium text-brand-blue bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors flex items-center disabled:opacity-50"
                >
                  {isUploading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  {isUploading ? 'Mengunggah...' : 'Pilih Ikon/Logo'}
                </button>
                <p className="text-xs text-gray-500 mt-2">Gunakan format PNG transparan atau JPG berukuran kecil.</p>
              </div>
            </div>
          </div>

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
              disabled={isUploading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-brand-lightblue shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-colors disabled:opacity-50"
            >
              Simpan Layanan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PublicServiceManagementPage;
