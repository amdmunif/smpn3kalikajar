import React, { useState, useEffect } from 'react';
import { Teacher } from '../../types';
import Modal from '../ui/Modal';

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacher: Teacher) => void;
  teacher: Teacher | null;
}

const TeacherFormModal: React.FC<TeacherFormModalProps> = ({ isOpen, onClose, onSave, teacher }) => {
  const [formData, setFormData] = useState<Omit<Teacher, 'id'>>({ nip: '', name: '', subject: '', phone: '', photo_url: '' });

  useEffect(() => {
    if (teacher) {
      setFormData({ nip: teacher.nip, name: teacher.name, subject: teacher.subject, phone: teacher.phone, photo_url: teacher.photo_url || '' });
    } else {
      setFormData({ nip: '', name: '', subject: '', phone: '', photo_url: '' });
    }
  }, [teacher, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="nip" className="block text-sm font-semibold text-gray-700 mb-1">NIP</label>
          <input 
            type="text" 
            name="nip" 
            id="nip" 
            value={formData.nip} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" 
            placeholder="Masukkan NIP"
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
          <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1">Mata Pelajaran / Jabatan</label>
          <input 
            type="text" 
            name="subject" 
            id="subject" 
            value={formData.subject} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" 
            placeholder="Contoh: Guru Matematika"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">Nomor Telepon</label>
          <input 
            type="tel" 
            name="phone" 
            id="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" 
            placeholder="08123456789"
          />
        </div>
        <div>
          <label htmlFor="photo_url" className="block text-sm font-semibold text-gray-700 mb-1">URL Foto (Opsional)</label>
          <input 
            type="url" 
            name="photo_url" 
            id="photo_url" 
            value={formData.photo_url || ''} 
            onChange={handleChange} 
            placeholder="https://contoh.com/foto.jpg" 
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" 
          />
          <p className="text-xs text-gray-500 mt-2">Gunakan link gambar langsung (.jpg atau .png). Kosongkan jika tidak ada foto.</p>
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
            className="px-5 py-2.5 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-brand-lightblue shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-colors"
          >
            Simpan Data
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TeacherFormModal;
