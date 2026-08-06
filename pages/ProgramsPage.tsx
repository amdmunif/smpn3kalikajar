import React from 'react';
import { INTRA_SUBJECTS, CO_CURRICULAR_PROJECTS, EXTRACURRICULARS } from '../constants';
import { GraduationCap, Zap, Layers } from 'lucide-react';

const PageHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="bg-brand-blue text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-4 text-lg text-gray-300">{subtitle}</p>
    </div>
  </div>
);

const ProgramsPage: React.FC = () => {
  return (
    <div className="bg-brand-background">
      <PageHeader title="Struktur Kurikulum" subtitle="Fondasi Pendidikan Holistik di SMP Negeri 3 Kalikajar" />

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Intrakurikuler Section */}
        <section>
          <div className="flex items-center text-brand-blue mb-8">
            <GraduationCap className="h-10 w-10 mr-4" />
            <div>
                <h2 className="text-3xl font-bold">Intrakurikuler</h2>
                <p className="text-gray-600">Kegiatan pembelajaran utama yang membentuk kompetensi dasar siswa.</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="mb-6 text-gray-700">Pembelajaran intrakurikuler di SMPN 3 Kalikajar dilaksanakan selama 6 hari sekolah, menekankan pada pendekatan berbasis literasi dan pengangkatan nilai-nilai budaya lokal. Model pembelajaran yang diterapkan mencakup Problem Based Learning, Project Based Learning, dan Discovery Learning untuk mendorong siswa berpikir kritis dan kreatif. Muatan lokal Bahasa Jawa dan Pariwisata (terintegrasi dalam Seni Budaya) menjadi bagian penting dari kurikulum kami.</p>
            
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Alokasi Waktu Mata Pelajaran Per Minggu</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Pelajaran</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam Pembelajaran</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {INTRA_SUBJECTS.map(subject => (
                            <tr key={subject.name}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.hours} Jam</td>
                            </tr>
                        ))}
                         <tr className="bg-gray-50 font-bold">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Total</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">41 Jam</td>
                        </tr>
                    </tbody>
                </table>
            </div>
          </div>
        </section>

        {/* Kokurikuler Section */}
        <section>
          <div className="flex items-center text-brand-blue mb-8">
            <Layers className="h-10 w-10 mr-4" />
            <div>
                <h2 className="text-3xl font-bold">Kokurikuler: Projek Penguatan Profil Pelajar Pancasila (P5)</h2>
                <p className="text-gray-600">Pembelajaran interdisipliner untuk memperkuat karakter dan kompetensi siswa.</p>
            </div>
          </div>
           <p className="mb-8 text-gray-700 max-w-4xl">Kegiatan P5 dilaksanakan setiap hari Jumat dan Sabtu. Siswa wajib menyelesaikan tiga tema projek dalam satu tahun ajaran untuk mengembangkan kemampuan berkolaborasi, memecahkan masalah, dan menghasilkan karya nyata.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {CO_CURRICULAR_PROJECTS.map(project => {
                 const Icon = project.icon;
                 return (
                    <div key={project.theme} className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center text-center">
                        <div className="bg-blue-100 text-brand-blue p-4 rounded-full mb-4">
                            <Icon className="h-10 w-10"/>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{project.theme}</h3>
                        <p className="mt-2 text-gray-500 text-sm font-medium">{project.semester}</p>
                        <p className="mt-4 text-gray-600 flex-grow">{project.description}</p>
                    </div>
                );
            })}
          </div>
        </section>

        {/* Ekstrakurikuler Section */}
        <section>
          <div className="flex items-center text-brand-blue mb-8">
            <Zap className="h-10 w-10 mr-4 text-brand-secondary" />
            <div>
                <h2 className="text-3xl font-bold">Ekstrakurikuler</h2>
                <p className="text-gray-600">Mengembangkan minat, bakat, dan keterampilan di luar jam pelajaran.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {EXTRACURRICULARS.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="bg-blue-100 text-brand-blue p-4 rounded-full mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="mt-2 text-sm text-gray-600 flex-grow">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProgramsPage;