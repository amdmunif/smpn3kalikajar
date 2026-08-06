import React, { useState, useEffect } from 'react';
import { Teacher } from '../../types';
import { X } from 'lucide-react';

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacher: Teacher) => void;
  teacher: Teacher | null;
}

const TeacherFormModal: React.FC<TeacherFormModalProps> = ({ isOpen, onClose, onSave, teacher }) => {
  const [formData, setFormData] = useState<Omit<Teacher, 'id'>>({ nip: '', name: '', subject: '', phone: '' });

  useEffect(() => {
    if (teacher) {
      setFormData({ nip: teacher.nip, name: teacher.name, subject: teacher.subject, phone: teacher.phone });
    } else {
      setFormData({ nip: '', name: '', subject: '', phone: '' });
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{teacher ? 'Edit Data Guru' : 'Tambah Guru Baru'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="nip" className="block text-sm font-medium text-gray-700">NIP</label>
              <input type="text" name="nip" id="nip" value={formData.nip} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Mata Pelajaran</label>
              <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
              <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300">Batal</button>
            <button type="submit" className="bg-brand-blue text-white py-2 px-4 rounded-md hover:bg-brand-lightblue">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherFormModal;
