# Website SMP Negeri 3 Kalikajar Website

Website resmi SMP Negeri 3 Kalikajar yang dibangun dengan PHP dan MySQL untuk memenuhi kebutuhan administrasi sekolah dan layanan publik.

## Fitur Utama

### 1. Multi-Role Login System
- Admin
- Guru
- BK
- Ketua Kelas
- Siswa

### 2. Dashboard AdminLTE
- Dashboard statistik
- Manajemen berita
- Manajemen galeri
- Manajemen PPDB
- Laporan kehadiran

### 3. Sistem Absensi
- Input absensi oleh Ketua Kelas
- Verifikasi absensi oleh BK
- Laporan kehadiran
- Status absensi siswa

### 4. PPDB Online
- Formulir pendaftaran online
- Upload berkas
- Status pendaftaran
- Verifikasi data

### 5. Manajemen Berita dan Galeri
- Posting berita
- Upload foto galeri
- Kategori berita dan galeri
- Komentar berita

## Persyaratan Sistem

### Software
- PHP 7.4 atau lebih tinggi
- MySQL 5.7 atau lebih tinggi
- Apache/Nginx
- Mod_rewrite enabled

### Ekstensi PHP
- PDO
- PDO_MySQL
- mbstring
- json
- gd
- fileinfo

## Instalasi

1. Clone repository:
```bash
git clone https://github.com/username/smpn3kalikajar.git
```

2. Buat database baru:
```sql
CREATE DATABASE smpn3kalikajar;
```

3. Import database schema:
```bash
mysql -u username -p smpn3kalikajar < database/schema.sql
```

4. Konfigurasi database di `includes/config.php`

5. Set permissions:
```bash
chmod -R 755 uploads
chmod 644 includes/config.php
chmod 644 includes/db.php
```

6. Akses website melalui browser

## Struktur Direktori

```
/ ├── index.php
├── login.php
├── logout.php
├── /admin/
├── /guru/
├── /bk/
├── /ketuakelas/
├── /siswa/
├── /ppdb/
├── /includes/
├── /uploads/
│   ├── galeri/
│   ├── berita/
│   └── ppdb/
└── /assets/
```

## Keamanan

1. Gunakan password yang kuat untuk database
2. Jangan share file konfigurasi
3. Aktifkan SSL/HTTPS
4. Backup database secara berkala
5. Update PHP dan extensions secara rutin

## Lisensi

MIT License - Copyright (c) 2025 SMP Negeri 3 Kalikajar
