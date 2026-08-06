import React, { useState, useEffect } from 'react';
import { Teacher } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import TeacherFormModal from '../../components/admin/TeacherFormModal';
import DataTable, { Column } from '../../components/ui/DataTable';

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

  const columns: Column<Teacher>[] = [
    {
      header: 'Foto',
      accessor: (teacher) => teacher.photo_url ? (
        <img src={teacher.photo_url} alt={teacher.name} className="h-10 w-10 rounded-full object-cover shadow-sm border border-gray-100" />
      ) : (
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-brand-blue font-bold shadow-sm">
          {teacher.name.charAt(0)}
        </div>
      ),
      className: 'w-16'
    },
    { header: 'NIP', accessor: 'nip', className: 'font-medium text-gray-900' },
    { header: 'Nama Lengkap', accessor: 'name' },
    { header: 'Jabatan', accessor: 'subject' },
    { header: 'Telepon', accessor: 'phone' },
    {
      header: 'Aksi',
      accessor: (teacher) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleOpenModal(teacher)} 
            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDeleteTeacher(teacher.id)} 
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
          <h1 className="text-3xl font-bold text-gray-900">Data Guru</h1>
          <p className="text-gray-500 mt-1">Kelola direktori pendidik dan tenaga kependidikan</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center px-5 py-2.5 bg-brand-blue text-white rounded-lg shadow-sm hover:bg-brand-lightblue focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tambah Guru
        </button>
      </div>

      <DataTable
        columns={columns}
        data={teachers}
        searchPlaceholder="Cari NIP, nama, atau jabatan..."
      />

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
