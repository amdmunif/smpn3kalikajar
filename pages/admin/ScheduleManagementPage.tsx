import React, { useState, useEffect } from 'react';
import { Schedule } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import ScheduleFormModal from '../../components/admin/ScheduleFormModal';

const ScheduleManagementPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/get_schedules.php');
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleOpenModal = (schedule: Schedule | null = null) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };

  const handleSaveSchedule = async (scheduleData: Schedule) => {
     try {
       if (scheduleData.id) { // Update
         const response = await fetch('/api/update_schedule.php', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(scheduleData)
         });
         const result = await response.json();
         if (result.success) {
           alert('Jadwal berhasil diperbarui!');
           fetchSchedules();
         } else {
           alert('Gagal: ' + result.message);
         }
       } else { // Create
         const response = await fetch('/api/create_schedule.php', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(scheduleData)
         });
         const result = await response.json();
         if (result.success) {
           alert('Jadwal baru berhasil ditambahkan!');
           fetchSchedules();
         } else {
           alert('Gagal: ' + result.message);
         }
       }
     } catch (error) {
       console.error('Error saving schedule:', error);
       alert('Terjadi kesalahan saat menyimpan data.');
     }
    handleCloseModal();
  };

  const handleDeleteSchedule = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      try {
        const response = await fetch(`/api/delete_schedule.php?id=${id}`);
        const result = await response.json();
        if (result.success) {
          alert('Jadwal berhasil dihapus!');
          fetchSchedules();
        } else {
          alert('Gagal: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting schedule:', error);
        alert('Terjadi kesalahan saat menghapus data.');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Jadwal Pelajaran</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-brand-blue text-white py-2 px-4 rounded-md hover:bg-brand-lightblue transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          Tambah Jadwal
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3">Hari</th>
                  <th scope="col" className="px-6 py-3">Waktu</th>
                  <th scope="col" className="px-6 py-3">Mata Pelajaran</th>
                  <th scope="col" className="px-6 py-3">Kelas</th>
                  <th scope="col" className="px-6 py-3">Guru</th>
                  <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {schedules.length > 0 ? schedules.sort((a,b) => ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].indexOf(a.day) - ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].indexOf(b.day)).map((schedule: Schedule) => (
                  <tr key={schedule.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{schedule.day}</td>
                    <td className="px-6 py-4">{schedule.time_start} - {schedule.time_end}</td>
                    <td className="px-6 py-4">{schedule.subject}</td>
                    <td className="px-6 py-4">{schedule.class_name}</td>
                    <td className="px-6 py-4">{schedule.teacher_name}</td>
                    <td className="px-6 py-4 flex justify-center space-x-2">
                      <button onClick={() => handleOpenModal(schedule)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteSchedule(schedule.id)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">Belum ada data jadwal.</td>
                  </tr>
                )}
              </tbody>
            </table>
        </div>
      </div>
      <ScheduleFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSchedule}
        schedule={selectedSchedule}
      />
    </div>
  );
};

export default ScheduleManagementPage;
