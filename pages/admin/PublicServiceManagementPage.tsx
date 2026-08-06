import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Briefcase } from 'lucide-react';

interface PublicService {
  id: number;
  name: string;
  description: string;
  icon_url: string;
}

const PublicServiceManagementPage: React.FC = () => {
  const [services, setServices] = useState<PublicService[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<PublicService | null>(null);
  const [formData, setFormData] = useState<Omit<PublicService, 'id'>>({ name: '', description: '', icon_url: '' });

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
        alert(`Layanan berhasil ${selectedService ? 'diperbarui' : 'ditambahkan'}!`);
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
          alert('Layanan berhasil dihapus!');
          fetchServices();
        } else {
          alert('Gagal: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Layanan Publik</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-brand-blue text-white py-2 px-4 rounded-md hover:bg-brand-lightblue transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          Tambah Layanan
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3">Ikon / Gambar</th>
                <th scope="col" className="px-6 py-3">Nama Layanan</th>
                <th scope="col" className="px-6 py-3">Deskripsi</th>
                <th scope="col" className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center">Belum ada daftar layanan.</td></tr>
              ) : (
                services.map((item) => (
                  <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {item.icon_url ? (
                        <img src={item.icon_url} alt={item.name} className="h-10 w-10 object-contain rounded" />
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                          <Briefcase className="h-5 w-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4"><p className="line-clamp-2">{item.description}</p></td>
                    <td className="px-6 py-4 flex justify-center space-x-2">
                      <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">{selectedService ? 'Edit Layanan' : 'Tambah Layanan Baru'}</h2>
              <button onClick={handleCloseModal} className="p-2 rounded-full hover:bg-gray-200">
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Layanan</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Contoh: Legalisir Ijazah" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Deskripsi Singkat</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} required placeholder="Syarat dan ketentuan layanan..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL Ikon / Gambar (Opsional)</label>
                <input type="url" name="icon_url" value={formData.icon_url} onChange={handleChange} placeholder="https://contoh.com/ikon.png" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" />
                <p className="text-xs text-gray-500 mt-1">Gunakan link ikon atau gambar ilustrasi berukuran kecil.</p>
              </div>

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

export default PublicServiceManagementPage;
