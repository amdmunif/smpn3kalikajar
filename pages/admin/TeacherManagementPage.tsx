import React, { useState, useEffect } from 'react';
import { Teacher } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import TeacherFormModal from '../../components/admin/TeacherFormModal';

const TeacherManagementPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers.php');
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleOpenModal = (teacher: Teacher | null = null) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
  };

  const handleSaveTeacher = async (teacherData: Teacher) => {
    try {
      if (teacherData.id) { // Update
        const response = await fetch('/api/teachers.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(teacherData),
        });
        const result = await response.json();
        if (result.success) {
          alert('Data guru berhasil diperbarui!');
          fetchTeachers();
        } else {
          alert('Gagal: ' + result.message);
        }
      } else { // Create
        const response = await fetch('/api/teachers.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(teacherData),
        });
        const result = await response.json();
        if (result.success) {
          alert('Guru baru berhasil ditambahkan!');
          fetchTeachers();
        } else {
          alert('Gagal: ' + result.message);
        }
      }
    } catch (error) {
      console.error('Error saving teacher:', error);
      alert('Terjadi kesalahan saat menyimpan data.');
    }
    handleCloseModal();
  };

  const handleDeleteTeacher = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data guru ini?')) {
      try {
        const response = await fetch(`/api/teachers.php?id=${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
          alert('Data guru berhasil dihapus!');
          fetchTeachers();
        } else {
          alert('Gagal: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting teacher:', error);
        alert('Terjadi kesalahan saat menghapus data.');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Data Guru</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-brand-blue text-white py-2 px-4 rounded-md hover:bg-brand-lightblue transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          Tambah Guru
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3">Foto</th>
                  <th scope="col" className="px-6 py-3">NIP</th>
                  <th scope="col" className="px-6 py-3">Nama Lengkap</th>
                  <th scope="col" className="px-6 py-3">Jabatan</th>
                  <th scope="col" className="px-6 py-3">Telepon</th>
                  <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher: Teacher) => (
                  <tr key={teacher.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {teacher.photo_url ? (
                        <img src={teacher.photo_url} alt={teacher.name} className="h-10 w-10 rounded-full object-cover border border-gray-200" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                          {teacher.name.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{teacher.nip}</td>
                    <td className="px-6 py-4">{teacher.name}</td>
                    <td className="px-6 py-4">{teacher.subject}</td>
                    <td className="px-6 py-4">{teacher.phone}</td>
                    <td className="px-6 py-4 flex justify-center space-x-2">
                      <button onClick={() => handleOpenModal(teacher)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteTeacher(teacher.id)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>

      <TeacherFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTeacher}
        teacher={selectedTeacher}
      />
    </div>
  );
};

export default TeacherManagementPage;
