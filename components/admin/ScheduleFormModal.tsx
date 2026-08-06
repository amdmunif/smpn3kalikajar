import React, { useState, useEffect } from 'react';
import { Schedule } from '../../types';
import { X } from 'lucide-react';

interface ScheduleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: Schedule) => void;
  schedule: Schedule | null;
}

const defaultFormData = {
  day: 'Senin' as Schedule['day'],
  time_start: '07:00',
  time_end: '08:30',
  subject: '',
  class_name: '',
  teacher_name: '',
};

const ScheduleFormModal: React.FC<ScheduleFormModalProps> = ({ isOpen, onClose, onSave, schedule }) => {
  const [formData, setFormData] = useState<Omit<Schedule, 'id'>>(defaultFormData);

  useEffect(() => {
    if (schedule) {
      setFormData({
        day: schedule.day,
        time_start: schedule.time_start,
        time_end: schedule.time_end,
        subject: schedule.subject,
        class_name: schedule.class_name,
        teacher_name: schedule.teacher_name,
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [schedule, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: schedule?.id || 0 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{schedule ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="day" className="block text-sm font-medium text-gray-700">Hari</label>
              <select name="day" id="day" value={formData.day} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm">
                <option>Senin</option>
                <option>Selasa</option>
                <option>Rabu</option>
                <option>Kamis</option>
                <option>Jumat</option>
                <option>Sabtu</option>
              </select>
            </div>
             <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Mata Pelajaran</label>
              <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" />
            </div>
            <div>
              <label htmlFor="time_start" className="block text-sm font-medium text-gray-700">Waktu Mulai</label>
              <input type="time" name="time_start" id="time_start" value={formData.time_start} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" />
            </div>
            <div>
              <label htmlFor="time_end" className="block text-sm font-medium text-gray-700">Waktu Selesai</label>
              <input type="time" name="time_end" id="time_end" value={formData.time_end} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" />
            </div>
            <div>
              <label htmlFor="class_name" className="block text-sm font-medium text-gray-700">Kelas</label>
              <input type="text" name="class_name" id="class_name" placeholder="Contoh: IX A" value={formData.class_name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" />
            </div>
            <div>
              <label htmlFor="teacher_name" className="block text-sm font-medium text-gray-700">Nama Guru</label>
              <input type="text" name="teacher_name" id="teacher_name" value={formData.teacher_name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" />
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

export default ScheduleFormModal;
