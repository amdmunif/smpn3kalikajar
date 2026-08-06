import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { CLASS_LIST } from '../../constants';
import { X } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  student: Student | null;
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({ isOpen, onClose, onSave, student }) => {
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({ nisn: '', name: '', class: CLASS_LIST[0], gender: 'Laki-laki', entryYear: new Date().getFullYear() });

  useEffect(() => {
    if (student) {
      setFormData({ nisn: student.nisn, name: student.name, class: student.class, gender: student.gender, entryYear: student.entryYear });
    } else {
      setFormData({ nisn: '', name: '', class: CLASS_LIST[0], gender: 'Laki-laki', entryYear: new Date().getFullYear() });
    }
  }, [student, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const val = name === 'entryYear' ? parseInt(value, 10) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: student?.id || 0 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{student ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="nisn" className="block text-sm font-medium text-gray-700">NISN</label>
              <input type="text" name="nisn" id="nisn" value={formData.nisn} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" />
            </div>
             <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700">Kelas</label>
              <select name="class" id="class" value={formData.class} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm">
                {CLASS_LIST.map(className => (
                    <option key={className} value={className}>{className}</option>
                ))}
              </select>
            </div>
             <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
              <select name="gender" id="gender" value={formData.gender} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm">
                <option>Laki-laki</option>
                <option>Perempuan</option>
              </select>
            </div>
            <div>
              <label htmlFor="entryYear" className="block text-sm font-medium text-gray-700">Tahun Masuk</label>
              <input type="number" name="entryYear" id="entryYear" value={formData.entryYear} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" />
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

export default StudentFormModal;
