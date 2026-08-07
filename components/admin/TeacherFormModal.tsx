import React, { useState, useEffect, useRef } from 'react';
import { Teacher } from '../../types';
import Modal from '../ui/Modal';
import { Upload, X, Loader } from 'lucide-react';

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacher: Teacher) => void;
  teacher: Teacher | null;
}

const TeacherFormModal: React.FC<TeacherFormModalProps> = ({ isOpen, onClose, onSave, teacher }) => {
  const [formData, setFormData] = useState<Omit<Teacher, 'id'>>({ nip: '', name: '', position: '', subject: '', phone: '', photo_url: '' });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (teacher) {
      setFormData({ 
        nip: teacher.nip || '', 
        name: teacher.name, 
        position: teacher.position || '', 
        subject: teacher.subject, 
        phone: teacher.phone, 
        photo_url: teacher.photo_url || '' 
      });
    } else {
      setFormData({ nip: '', name: '', position: '', subject: '', phone: '', photo_url: '' });
    }
  }, [teacher, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setFormData(prev => ({ ...prev, photo_url: data.url }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: teacher?.id || 0 });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={teacher ? 'Edit Data Guru' : 'Tambah Guru Baru'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="nip" className="block text-sm font-semibold text-gray-700 mb-1">NIP <span className="text-gray-400 font-normal">(Opsional)</span></label>
            <input 
              type="text" 
              name="nip" 
              id="nip" 
              value={formData.nip} 
              onChange={handleChange} 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" 
              placeholder="Kosongkan jika tidak ada"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" 
              placeholder="Masukkan Nama Lengkap"
            />
          </div>
          
          <div>
            <label htmlFor="position" className="block text-sm font-semibold text-gray-700 mb-1">Jabatan</label>
            <select 
              name="position" 
              id="position" 
              value={formData.position} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" 
            >
              <option value="" disabled>Pilih Jabatan</option>
              <option value="Kepala Sekolah">Kepala Sekolah</option>
              <option value="Wakil Kepala Sekolah">Wakil Kepala Sekolah</option>
              <option value="Guru">Guru</option>
              <option value="Kepala Tata Usaha">Kepala Tata Usaha</option>
              <option value="Staff Tata Usaha">Staff Tata Usaha</option>
            </select>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1">Guru Mata Pelajaran</label>
            <input 
              type="text" 
              name="subject" 
              id="subject" 
              value={formData.subject} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" 
              placeholder="Contoh: Matematika"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">Nomor Telepon <span className="text-gray-400 font-normal">(Opsional)</span></label>
            <input 
              type="tel" 
              name="phone" 
              id="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" 
              placeholder="Kosongkan jika tidak ada"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Foto <span className="text-gray-400 font-normal">(Opsional)</span></label>
          <div className="mt-1 flex items-center space-x-4">
            {formData.photo_url ? (
              <div className="relative h-24 w-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                <img src={formData.photo_url} alt="Preview" className="h-full w-full object-contain" />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, photo_url: '' }))}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg hover:bg-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="h-24 w-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-400">
                <Upload className="h-6 w-6" />
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
                {isUploading ? 'Mengunggah...' : 'Pilih Foto'}
              </button>
              <p className="text-xs text-gray-500 mt-2">Gunakan format JPG/PNG, direkomendasikan ukuran pas foto (3x4).</p>
            </div>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            disabled={isUploading}
            className="px-5 py-2.5 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-brand-lightblue shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-colors disabled:opacity-50"
          >
            Simpan Data
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TeacherFormModal;
