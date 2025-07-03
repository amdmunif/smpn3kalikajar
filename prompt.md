# 🏫 PROMPT FINAL PEMBUATAN WEBSITE SMP NEGERI 3 KALIKAJAR (LENGKAP)

Buatkan website sekolah bernama **SMP Negeri 3 Kalikajar** yang modern, responsif, dan memiliki sistem manajemen konten sekolah yang lengkap. Teknologi yang digunakan: PHP + MySQL (boleh dikembangkan ke Laravel), HTML/CSS/JavaScript. 

🎯 **Tujuan**:
- Website publik sebagai sarana informasi resmi sekolah
- Panel admin/dashboard terpisah total dari landing page
- Sistem login dengan dukungan multi-role (terutama untuk guru)
- Sistem absensi harian oleh ketua kelas yang diverifikasi oleh guru BK
- UI dashboard menggunakan gaya **AdminLTE**

📌 **Fitur Halaman Publik (Landing Page)**:
1. **Beranda**: sambutan kepala sekolah, berita, slider kegiatan, tombol CTA untuk PPDB
2. **Profil Sekolah**: visi-misi, sejarah, struktur organisasi, guru dan staf
3. **Akademik**: jadwal, kurikulum, kalender akademik
4. **Kegiatan & Prestasi**: dokumentasi OSIS, ekskul, lomba, prestasi siswa
5. **PPDB Online**: info + form pendaftaran
6. **Galeri Foto & Video**
7. **Kontak**: alamat, Google Maps, email, form kontak

🛠️ **Portal Login**:
- Admin
- Guru
- Siswa
- Ketua kelas
- Guru BK

Setelah login, setiap pengguna diarahkan ke **dashboard yang bergaya AdminLTE**, **tanpa membawa elemen landing page** (tidak ada header publik, slider, atau footer umum).

🔐 **Sistem Multi-Role (Terutama untuk Guru)**:
- Guru bisa memiliki beberapa peran sekaligus: guru biasa, guru BK, admin, wakil kepala sekolah, dll.
- Gunakan tabel `user_roles` untuk mendukung banyak peran per user.
- Setelah login, tampilkan pilihan “Lihat Sebagai...” (role switcher) jika user memiliki lebih dari satu peran.
- Hak akses dan fitur diatur berdasarkan role aktif yang sedang dipilih.

📂 **Struktur Panel Dashboard (AdminLTE-style)**:
- `/admin/` untuk admin dashboard
- `/guru/`, `/bk/`, `/ketuakelas/`, `/siswa/` → masing-masing dengan tampilan dashboard sendiri
- Tampilan sidebar, topbar, dan card seperti AdminLTE
- Setiap dashboard sesuai peran aktif

📋 **Fitur Panel Admin**:
- CRUD konten (berita, sambutan, slider, galeri)
- Manajemen pengguna dan role (admin bisa menambahkan role tambahan ke guru)
- Kelola data pendaftar PPDB
- Upload dokumen, jadwal, kalender akademik
- Rekap dan ekspor data absensi
- Log aktivitas pengguna (opsional)

📅 **Fitur Absensi Harian Ketua Kelas (Terverifikasi oleh Guru BK)**:
- Ketua kelas login → isi absensi siswa di kelasnya
- Status: hadir / izin / sakit / alpha + keterangan
- Absensi masuk antrean verifikasi guru BK
- Guru BK login → verifikasi, edit jika perlu, lalu simpan sebagai resmi
- Admin dan guru BK bisa unduh/export rekap absensi per kelas/per tanggal

🗃️ **Skema Database Utama**:
1. `users` – data semua pengguna (guru, siswa, admin, ketua kelas, BK)
2. `user_roles` – menyimpan banyak role per user (multi-role support)
3. `berita`, `galeri`, `ppdb` – konten publik
4. `absensi` – data absensi harian per kelas
5. `absensi_detail` – status kehadiran per siswa per tanggal

🎨 **Desain dan UX**:
- Landing page: kombinasi biru navy dan putih, clean dan profesional
- Dashboard: gaya **AdminLTE** lengkap dengan sidebar, card statistik, form, dan data table
- Mobile responsive
- Navigasi mudah dimengerti

📁 **Struktur Folder Proyek**:
```
smpn3kalikajar/
├── index.php         <-- Landing page
├── login.php
├── logout.php
├── /admin/           <-- Dashboard Admin
├── /guru/            <-- Dashboard Guru (multi-role switcher)
├── /bk/              <-- Dashboard Guru BK
├── /ketuakelas/      <-- Dashboard Ketua Kelas
├── /siswa/           <-- Dashboard Siswa
├── /ppdb/            <-- Halaman/form pendaftaran
├── /includes/        <-- config.php, auth.php, db.php
├── /adminlte/        <-- CSS/JS template dashboard
├── /assets/          <-- asset publik
└── /uploads/
```

⚙️ Jika memungkinkan, sertakan juga:
- Validasi input form
- Proteksi login session
- Hak akses berdasarkan role aktif