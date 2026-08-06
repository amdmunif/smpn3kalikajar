import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Student, Attendance } from '../../types';
import { STUDENTS } from '../../constants';
import { Loader, AlertTriangle, Send, CheckCircle, UserCheck, Inbox, Clock } from 'lucide-react';

// =================================
// Tampilan untuk Ketua Kelas
// =================================
const KetuaKelasView: React.FC<{ user: NonNullable<ReturnType<typeof useAuth>['user']> }> = ({ user }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<number, Attendance['status']>>({});
  const [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    setLoading(true);
    // Fetch students for the class president's class
    fetch(`/api/get_students_by_class.php?class=${user.class}`)
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        const initialAttendance = data.reduce((acc: Record<number, Attendance['status']>, student: Student) => {
          acc[student.id] = 'Hadir';
          return acc;
        }, {});
        setAttendance(initialAttendance);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching students:', err);
        setLoading(false);
      });
  }, [user.class]);

  const handleStatusChange = (studentId: number, status: Attendance['status']) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    
    const date = new Date().toISOString().split('T')[0];
    const payload = students.map(student => ({
      student_id: student.id,
      date: date,
      status: attendance[student.id]
    }));

    try {
      const response = await fetch('/api/submit_attendance.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.success) {
        alert('Absensi berhasil diserahkan untuk konfirmasi!');
        setSubmitStatus('success');
      } else {
        alert('Gagal mengirim absensi: ' + result.message);
        setSubmitStatus('idle');
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Terjadi kesalahan saat mengirim absensi.');
      setSubmitStatus('idle');
    }
  };
  
  if (loading) return <div className="flex items-center justify-center p-10"><Loader className="h-8 w-8 animate-spin text-brand-blue" /> <p className="ml-3">Memuat data kelas...</p></div>;

  if (submitStatus === 'success') {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Absensi Berhasil Dikirim!</h2>
            <p className="text-gray-600 mt-2">Terima kasih, data absensi hari ini telah berhasil diserahkan kepada Guru BK untuk dikonfirmasi.</p>
        </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-1">Input Absensi Harian</h2>
      <p className="text-gray-600 mb-6">Kelas: <span className="font-semibold text-brand-blue">{user.class}</span> | Tanggal: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
          {students.map(student => (
            <div key={student.id} className="grid grid-cols-6 gap-4 items-center border-b pb-4">
              <span className="col-span-2 font-medium">{student.name}</span>
              <div className="col-span-4 flex justify-around">
                {(['Hadir', 'Sakit', 'Izin', 'Alpa'] as const).map(status => (
                  <label key={status} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`student-${student.id}`}
                      value={status}
                      checked={attendance[student.id] === status}
                      onChange={() => handleStatusChange(student.id, status)}
                      className="form-radio h-4 w-4 text-brand-blue focus:ring-brand-blue"
                    />
                    <span>{status}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <button type="submit" disabled={submitStatus === 'submitting'} className="flex items-center bg-brand-blue text-white py-2 px-6 rounded-md hover:bg-brand-lightblue transition-colors disabled:bg-gray-400">
            {submitStatus === 'submitting' ? <><Loader className="h-5 w-5 mr-2 animate-spin" />Mengirim...</> : <><Send className="h-5 w-5 mr-2" />Kirim Absensi</>}
          </button>
        </div>
      </form>
    </div>
  );
};


// =================================
// Tampilan untuk Guru BK
// =================================
interface GroupedAttendance {
  [key: string]: Attendance[];
}

const GuruBKView: React.FC = () => {
  const [unconfirmed, setUnconfirmed] = useState<GroupedAttendance>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnconfirmed();
  }, []);

  const fetchUnconfirmed = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/get_unconfirmed_attendance.php');
      const data: Attendance[] = await response.json();
      
      // Group by class and date
      const grouped: GroupedAttendance = {};
      data.forEach(att => {
        const key = `${att.class_name} | ${att.date}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(att);
      });
      setUnconfirmed(grouped);
    } catch (error) {
      console.error('Error fetching unconfirmed attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (key: string) => {
    const [className, date] = key.split(' | ');
    if (window.confirm(`Apakah Anda yakin ingin mengonfirmasi absensi untuk kelas ${className} pada tanggal ${date}?`)) {
        try {
          const attendancesToConfirm = unconfirmed[key];
          let successCount = 0;
          for (const att of attendancesToConfirm) {
            const res = await fetch('/api/confirm_attendance.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: att.id })
            });
            const result = await res.json();
            if (result.success) successCount++;
          }
          
          alert(`${successCount} dari ${attendancesToConfirm.length} absensi berhasil dikonfirmasi!`);
          fetchUnconfirmed(); // Refresh data
        } catch (error) {
          console.error('Error confirming attendance:', error);
          alert('Terjadi kesalahan saat mengonfirmasi absensi.');
        }
    }
  };

  if (loading) return <div className="flex items-center justify-center p-10"><Loader className="h-8 w-8 animate-spin text-brand-blue" /><p className="ml-3">Memuat data konfirmasi...</p></div>;

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Konfirmasi Absensi Siswa</h1>
        {Object.keys(unconfirmed).length === 0 ? (
             <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <Inbox className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Tidak Ada Data</h2>
                <p className="text-gray-600 mt-2">Saat ini tidak ada data absensi yang perlu dikonfirmasi.</p>
            </div>
        ) : (
            Object.entries(unconfirmed).map(([key, attendances]) => {
                const [className, date] = key.split(' | ');
                const formattedDate = new Date(date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                return (
                    <div key={key} className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-brand-blue">{className}</h3>
                                <p className="text-sm text-gray-500">Tanggal: {formattedDate}</p>
                            </div>
                            <button onClick={() => handleConfirm(key)} className="flex items-center bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors">
                                <UserCheck className="h-5 w-5 mr-2" /> Konfirmasi
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {attendances.map(att => (
                                <div key={att.id} className={`p-3 rounded-md flex justify-between items-center text-sm ${
                                    att.status === 'Hadir' ? 'bg-green-50 text-green-800' :
                                    att.status === 'Sakit' ? 'bg-yellow-50 text-yellow-800' :
                                    att.status === 'Izin' ? 'bg-blue-50 text-blue-800' :
                                    'bg-red-50 text-red-800'
                                }`}>
                                    <span>{att.student_name}</span>
                                    <span className="font-semibold">{att.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })
        )}
    </div>
  );
};


// =================================
// Tampilan untuk Admin
// =================================
const AdminView: React.FC = () => (
  <div className="bg-white p-8 rounded-lg shadow-md text-center">
    <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
    <h2 className="text-2xl font-bold">Riwayat & Laporan Absensi</h2>
    <p className="text-gray-600 mt-2">
      Sebagai Admin, Anda dapat melihat riwayat absensi keseluruhan. Fitur laporan absensi per siswa dan per kelas sedang dalam pengembangan.
    </p>
  </div>
);

// =================================
// Komponen Utama
// =================================
const AttendanceManagementPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader className="h-8 w-8 animate-spin text-brand-blue" />
        <p className="ml-3 text-gray-600">Memuat data pengguna...</p>
      </div>
    );
  }

  switch (user.role) {
    case 'ketua_kelas':
      return <KetuaKelasView user={user} />;
    case 'guru_bk':
      return <GuruBKView />;
    case 'admin':
      return <AdminView />;
    default:
      return <div className="text-red-500 font-bold">Peran pengguna tidak dikenali.</div>;
  }
};

export default AttendanceManagementPage;
