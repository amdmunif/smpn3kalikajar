import { NewsArticle, GalleryItem, Extracurricular, Facility, Student, Teacher, Schedule, PageContent } from './types';
import { Dumbbell, Flag, BriefcaseMedical, Drama, BookCopy, ShieldCheck, Vote, Flame, Briefcase } from 'lucide-react';

// This file contains mock data to simulate fetching from a database.
// This allows the admin panel to be fully interactive for preview purposes without a live backend.

export const SCHOOL_PROFILE = {
  welcome: {
    headmasterName: 'Sunarto, S. Pd.',
    message: 'Assalamu\'alaikum Wr. Wb. Puji syukur kami panjatkan kehadirat Allah SWT atas rahmat dan karunia-Nya. Selamat datang di website resmi SMP Negeri 3 Kalikajar. Berlokasi strategis di lereng Gunung Sumbing yang sejuk dan asri, kami berkomitmen menciptakan lingkungan belajar yang nyaman dan kondusif. Melalui platform digital ini, kami berupaya menyajikan informasi yang relevan dan membangun komunikasi yang erat dengan seluruh warga sekolah dan masyarakat, demi mewujudkan visi kita bersama: mencetak generasi yang berakhlak mulia, berprestasi, dan berwawasan lingkungan.',
    imageUrl: 'https://picsum.photos/id/1005/300/300'
  },
  vision: 'Terwujudnya insan sekolah yang berakhlak mulia, berprestasi, berketerampilan, dan berwawasan lingkungan.',
  mission: [
    'Menyelenggarakan pendidikan yang berlandaskan ajaran agama.',
    'Menyelenggarakan pendidikan yang menumbuhkan budaya yang berakhlak mulia.',
    'Melaksanakan penilaian sikap secara intensif melalui guru mata pelajaran dan bimbingan konseling.',
    'Melaksanakan pembelajaran yang aktif, inovatif, kreatif, efektif, dan menyenangkan.',
    'Meningkatkan nilai semua mata pelajaran melalui remedial dan pengayaan.',
    'Meningkatkan prestasi dalam bidang akademik melalui bimbingan intensif melalui pembimbingan oleh guru mata pelajaran.',
    'Meningkatkan prestasi dalam bidang nonakademik melalui kegiatan ekstrakurikuler.',
    'Mengembangkan kompetensi peserta didik dalam menguasai ilmu pengetahuan dan teknologi.',
    'Menyelenggarakan kegiatan mengolah bahan-bahan yang tidak terpakai menjadi barang berguna melalui pembelajaran intra dan ekstrakurikuler.',
    'Menyelenggarakan kegiatan mengolah bahan makanan yang ada di lingkungan sekitar melalui pembelajaran intra dan ekstrakurikuler.',
    'Menyelenggarakan pembelajaran untuk menumbuhkan kepedulian terhadap lingkungan melalui kegiatan Jumat ASRI dan P5.',
    'Melaksanakan pembelajaran pendidikan lingkungan hidup.',
    'Menciptakan lingkungan ASRI sebagai upaya dalam pelestarian dan pengelolaan lingkungan.',
    'Meningkatkan peran serta masyarakat dalam menciptakan lingkunagan yang sehat dan kondusif.'
  ],
  history: 'SMP Negeri 3 Kalikajar secara geografis masuk wilayah Kabupaten Wonosobo, tepatnya di Desa Kembaran, Kecamatan Kalikajar. Terletak pada ketinggian 1353 mdpl, lokasi sekolah sangat strategis karena berada di tengah-tengah pedesaan lereng gunung Sumbing yang sejuk, dikaruniai alam yang indah dengan hamparan ladang pertanian yang luas, hijau, subur dan berlimpahnya sumber mata air. Kondisi ini mendukung lingkungan belajar yang nyaman dan kondusif. Dengan fasilitas yang lengkap dan dukungan masyarakat, sekolah menjadi pusat ekonomi, sosial dan budaya bagi desa-desa di sekitarnya.'
};

export const FACILITIES: Facility[] = [
  { id: 1, name: '16 Ruang Kelas', description: 'Ruang kelas yang bersih dan sehat, dilengkapi ventilasi yang memadai untuk kenyamanan belajar.', imageUrl: 'https://picsum.photos/id/24/400/300' },
  { id: 2, name: 'Perpustakaan', description: 'Koleksi buku paket dan penunjang untuk menambah pengetahuan peserta didik.', imageUrl: 'https://picsum.photos/id/20/400/300' },
  { id: 3, name: 'Laboratorium IPA', description: 'Dilengkapi fasilitas untuk kegiatan pembelajaran IPA dengan materi praktikum.', imageUrl: 'https://picsum.photos/id/30/400/300' },
  { id: 4, name: '2 Laboratorium Komputer', description: 'Tersedia 58 unit komputer untuk menunjang pembelajaran berbasis teknologi.', imageUrl: 'https://picsum.photos/id/40/400/300' },
  { id: 5, name: 'Lapangan Upacara & Olahraga', description: 'Area multifungsi untuk upacara, kegiatan basket, voli, dan futsal.', imageUrl: 'https://picsum.photos/id/1054/400/300' },
  { id: 6, name: 'Mushola & Sarana Ibadah', description: 'Pusat kegiatan keagamaan dan pembinaan karakter siswa.', imageUrl: 'https://picsum.photos/id/1062/400/300' },
  { id: 7, name: 'Kolam Renang', description: 'Sarana pendukung kegiatan belajar mengajar olahraga dan ekstrakurikuler renang.', imageUrl: 'https://picsum.photos/id/145/400/300' },
  { id: 8, name: 'Ruang UKS & BK', description: 'Memberikan layanan kesehatan dan bimbingan konseling untuk siswa.', imageUrl: 'https://picsum.photos/id/338/400/300' }
];

export const INTRA_SUBJECTS = [
    { name: 'Pendidikan Agama dan Budi Pekerti (PABP)', hours: 3 },
    { name: 'Pendidikan Pancasila (PP)', hours: 3 },
    { name: 'Bahasa Indonesia', hours: 6 },
    { name: 'Matematika', hours: 5 },
    { name: 'Ilmu Pengetahuan Alam (IPA)', hours: 5 },
    { name: 'Ilmu Pengetahuan Sosial (IPS)', hours: 4 },
    { name: 'Bahasa Inggris', hours: 4 },
    { name: 'Pendidikan Jasmani, Olahraga & Kesehatan (PJOK)', hours: 3 },
    { name: 'Informatika', hours: 3 },
    { name: 'Seni Budaya', hours: 3 },
    { name: 'Bahasa Jawa', hours: 2 },
];

export const CO_CURRICULAR_PROJECTS = [
    {
        icon: Vote,
        theme: 'Suara Demokrasi',
        description: 'Siswa belajar tentang teori demokrasi dan mengimplementasikannya dalam kegiatan pemilihan ketua OSIS (PILKETOS).',
        semester: 'Semester 1 & 2'
    },
    {
        icon: Flame,
        theme: 'Kearifan Lokal',
        description: 'Memahami dan mempraktikkan cara pembuatan balon udara tradisional dan tari daerah sebagai bagian dari budaya lokal.',
        semester: 'Semester 1'
    },
    {
        icon: Briefcase,
        theme: 'Kewirausahaan',
        description: 'Mengidentifikasi peluang usaha, membuat produk makanan lokal, dan memasarkannya dalam kegiatan "Market Day".',
        semester: 'Semester 2'
    },
];

export const EXTRACURRICULARS: Extracurricular[] = [
  { id: 1, name: 'Pramuka', description: 'Membentuk kepribadian yang beriman, berakhlak mulia, berjiwa patriotik, dan taat hukum.', icon: Flag },
  { id: 2, name: 'PMR (Palang Merah Remaja)', description: 'Memberikan pengetahuan dan keterampilan dasar pertolongan pertama serta menumbuhkan jiwa sosial.', icon: BriefcaseMedical },
  { id: 3, name: 'Olahraga Prestasi', description: 'Wadah pengembangan bakat di cabang Renang, Pencak Silat, Atletik, Sepakbola, dan Bolavoli.', icon: Dumbbell },
  { id: 4, name: 'TUB & PBB', description: 'Melatih kedisiplinan, kekompakan, dan menumbuhkan rasa cinta tanah air melalui Tata Upacara Bendera dan Peraturan Baris Berbaris.', icon: ShieldCheck },
  { id: 5, name: 'Seni Tari', description: 'Wadah untuk mengembangkan dan mengekspresikan diri melalui seni tari tradisional Indonesia.', icon: Drama },
  { id: 6, name: 'Madrasah Diniyah', description: 'Kegiatan wajib untuk memperdalam ilmu agama Islam dan baca tulis Al-Quran dengan metode Yanbu\'a.', icon: BookCopy },
];


export const NEWS_ARTICLES: NewsArticle[] = [
  { id: 1, title: 'SMPN 3 Kalikajar Juara 1 Lomba Cerdas Cermat Tingkat Kabupaten', date: '15 Juli 2024', excerpt: 'Tim cerdas cermat kami berhasil meraih prestasi gemilang dalam kompetisi yang diikuti puluhan sekolah...', imageUrl: 'https://picsum.photos/id/101/400/300', category: 'Prestasi' },
  { id: 2, title: 'Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2025/2026 Dibuka', date: '10 Juli 2024', excerpt: 'Informasi lengkap mengenai jadwal, syarat, dan alur pendaftaran PPDB online dapat diakses di sini...', imageUrl: 'https://picsum.photos/id/102/400/300', category: 'Pengumuman' },
  { id: 3, title: 'Kegiatan Class Meeting Meriahkan Akhir Semester Genap', date: '25 Juni 2024', excerpt: 'Berbagai lomba antar kelas diadakan untuk mempererat kebersamaan dan menyegarkan pikiran setelah ujian...', imageUrl: 'https://picsum.photos/id/103/400/300', category: 'Kegiatan' },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, imageUrl: 'https://picsum.photos/seed/school1/500/500', caption: 'Upacara Bendera Setiap Hari Senin' },
  { id: 2, imageUrl: 'https://picsum.photos/seed/school2/500/500', caption: 'Kegiatan Belajar Mengajar di Kelas' },
  { id: 3, imageUrl: 'https://picsum.photos/seed/school3/500/500', caption: 'Praktikum di Laboratorium IPA' },
  { id: 4, imageUrl: 'https://picsum.photos/seed/school4/500/500', caption: 'Siswa Membaca di Perpustakaan' },
  { id: 5, imageUrl: 'https://picsum.photos/seed/school5/500/500', caption: 'Tim Futsal Berlatih di Lapangan' },
  { id: 6, imageUrl: 'https://picsum.photos/seed/school6/500/500', caption: 'Pentas Seni Akhir Tahun' },
];

// === Mock Data for Admin Panel Preview ===
export const CLASS_LIST = [
    '7A', '7B', '7C', '7D', '7E',
    '8A', '8B', '8C', '8D', '8E',
    '9A', '9B', '9C', '9D', '9E', '9F',
];

export const STUDENTS: Student[] = [
  { id: 1, nisn: '0081234567', name: 'Ahmad Budi Santoso', class: '9A', gender: 'Laki-laki', entryYear: 2022 },
  { id: 2, nisn: '0087654321', name: 'Citra Lestari', class: '9B', gender: 'Perempuan', entryYear: 2022 },
  { id: 3, nisn: '0082345678', name: 'Dewi Anggraini', class: '8A', gender: 'Perempuan', entryYear: 2023 },
  { id: 4, nisn: '0088765432', name: 'Eko Prasetyo', class: '8C', gender: 'Laki-laki', entryYear: 2023 },
  { id: 5, nisn: '0083456789', name: 'Fitriani Hidayah', class: '7A', gender: 'Perempuan', entryYear: 2024 },
  { id: 6, nisn: '0089876543', name: 'Galih Wijaya', class: '7B', gender: 'Laki-laki', entryYear: 2024 },
];

export const TEACHERS: Teacher[] = [
  { id: 1, nip: '197501012005011001', name: 'Drs. Subagyo', subject: 'Matematika', phone: '081234567890' },
  { id: 2, nip: '198002022006022002', name: 'Sri Handayani, S.Pd.', subject: 'Bahasa Indonesia', phone: '081234567891' },
  { id: 3, nip: '198503032008031003', name: 'Bambang Irawan, M.Pd.', subject: 'IPA', phone: '081234567892' },
  { id: 4, nip: '199004042010042004', name: 'Anisa Fitri, S.Kom.', subject: 'TIK', phone: '081234567893' },
];

export const SCHEDULES: Schedule[] = [
    { id: 1, day: 'Senin', time_start: '07:00', time_end: '08:30', subject: 'Bahasa Indonesia', class_name: '7A', teacher_name: 'Sri Handayani, S.Pd.'},
    { id: 2, day: 'Senin', time_start: '08:30', time_end: '10:00', subject: 'Matematika', class_name: '7A', teacher_name: 'Drs. Subagyo'},
    { id: 3, day: 'Selasa', time_start: '07:00', time_end: '08:30', subject: 'IPA', class_name: '8B', teacher_name: 'Bambang Irawan, M.Pd.'},
];

export const PAGE_CONTENT: PageContent = {
  vision: SCHOOL_PROFILE.vision,
  mission: SCHOOL_PROFILE.mission.join('\n'), // Join array into a string for textarea
  history: SCHOOL_PROFILE.history,
  headmaster_name: SCHOOL_PROFILE.welcome.headmasterName,
  welcome_message: SCHOOL_PROFILE.welcome.message,
};
