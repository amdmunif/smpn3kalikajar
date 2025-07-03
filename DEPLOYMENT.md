# Panduan Deployment Website SMP Negeri 3 Kalikajar

## Persyaratan Sistem

### Hosting
- PHP 7.4 atau lebih tinggi
- MySQL 5.7 atau lebih tinggi
- Apache/Nginx web server
- Mod_rewrite enabled
- PHP extensions:
  - PDO
  - PDO_MySQL
  - mbstring
  - json
  - gd
  - fileinfo

### Database
- Nama database: smpn3kalikajar
- Charset: utf8mb4
- Collation: utf8mb4_general_ci

## Langkah-langkah Deployment

### 1. Persiapan Hosting
1. Pastikan PHP dan MySQL sudah terinstall
2. Aktifkan mod_rewrite di Apache/Nginx
3. Buat database baru dengan nama `smpn3kalikajar`
4. Import file `database/schema.sql` ke database

### 2. Upload File
1. Upload semua file ke hosting Anda
2. Struktur folder yang perlu diupload:
```
/
├── index.php
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

### 3. Konfigurasi Database
1. Buka file `includes/config.php`
2. Sesuaikan konfigurasi database:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'username_anda');
define('DB_PASS', 'password_anda');
define('DB_NAME', 'smpn3kalikajar');
```

### 4. Set Permissions
```bash
chmod -R 755 uploads
chmod -R 755 cache
chmod 644 includes/config.php
chmod 644 includes/db.php
```

### 5. Konfigurasi Web Server

#### Untuk Apache
- Pastikan mod_rewrite sudah aktif
- Pastikan file `.htaccess` sudah ada di root
- Pastikan `AllowOverride All` di konfigurasi virtual host

#### Untuk Nginx
- Copy file `nginx.conf` ke konfigurasi server
- Sesuaikan path root ke direktori website Anda
- Restart Nginx setelah perubahan

### 6. Verifikasi
1. Akses website melalui browser
2. Login sebagai admin:
   - Username: admin
   - Password: admin123
3. Ganti password admin segera setelah login
4. Test semua fitur:
   - Login/logout
   - Dashboard admin
   - PPDB
   - Absensi
   - Galeri
   - Berita

## Keamanan

1. Ganti password admin default
2. Pastikan file konfigurasi tidak dapat diakses publik
3. Gunakan SSL/HTTPS
4. Backup database secara berkala
5. Update PHP dan extensions secara rutin
6. Monitor log server secara berkala

## Troubleshooting

### Masalah Umum
1. **500 Internal Server Error**
   - Periksa permission file dan folder
   - Periksa log error server
   - Pastikan mod_rewrite aktif

2. **Database Connection Error**
   - Periksa konfigurasi database di `config.php`
   - Pastikan database sudah dibuat
   - Pastikan user database memiliki hak akses

3. **File Upload Error**
   - Periksa permission folder uploads
   - Periksa quota hosting
   - Periksa PHP configuration (upload_max_filesize)

## Catatan Penting

1. Backup database secara berkala
2. Simpan file konfigurasi dengan aman
3. Jangan share kredensial admin
4. Update website secara berkala
5. Monitor penggunaan resource hosting
