import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import StudentFormModal from '../../components/admin/StudentFormModal';

const StudentManagementPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/get_students.php');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleOpenModal = (student: Student | null = null) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleSaveStudent = async (studentData: Student) => {
    try {
      if (studentData.id) { // Update existing student
        const response = await fetch('/api/update_student.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData),
        });
        const result = await response.json();
        if (result.success) {
          alert('Data siswa berhasil diperbarui!');
          fetchStudents();
        } else {
          alert('Gagal: ' + result.message);
        }
      } else { // Add new student
        const response = await fetch('/api/create_student.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData),
        });
        const result = await response.json();
        if (result.success) {
          alert('Siswa baru berhasil ditambahkan!');
          fetchStudents();
        } else {
          alert('Gagal: ' + result.message);
        }
      }
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Terjadi kesalahan saat menyimpan data.');
    }
    handleCloseModal();
  };

  const handleDeleteStudent = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
      try {
        const response = await fetch(`/api/delete_student.php?id=${id}`);
        const result = await response.json();
        if (result.success) {
          alert('Data siswa berhasil dihapus!');
          fetchStudents();
        } else {
          alert('Gagal: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Terjadi kesalahan saat menghapus data.');
      }
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Data Siswa</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-brand-blue text-white py-2 px-4 rounded-md hover:bg-brand-lightblue transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          Tambah Siswa
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3">NISN</th>
                  <th scope="col" className="px-6 py-3">Nama Lengkap</th>
                  <th scope="col" className="px-6 py-3">Kelas</th>
                  <th scope="col" className="px-6 py-3">Jenis Kelamin</th>
                  <th scope="col" className="px-6 py-3">Tahun Masuk</th>
                  <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student: Student) => (
                  <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{student.nisn}</td>
                    <td className="px-6 py-4">{student.name}</td>
                    <td className="px-6 py-4">{student.class}</td>
                    <td className="px-6 py-4">{student.gender}</td>
                    <td className="px-6 py-4">{student.entryYear}</td>
                    <td className="px-6 py-4 flex justify-center space-x-2">
                      <button onClick={() => handleOpenModal(student)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteStudent(student.id)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
      <StudentFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveStudent}
        student={selectedStudent}
      />
    </div>
  );
};

export default StudentManagementPage;
