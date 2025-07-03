<?php
require_once 'includes/config.php';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SMP Negeri 3 Kalikajar</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        :root {
            --primary-color: #0d6efd;
            --secondary-color: #6c757d;
            --background-color: #f8f9fa;
        }

        .hero {
            background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('assets/images/hero-bg.jpg');
            background-size: cover;
            background-position: center;
            height: 80vh;
            color: white;
            text-align: center;
            padding: 100px 20px;
        }

        .feature-card {
            border: none;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-5px);
        }

        .cta-button {
            padding: 12px 30px;
            font-size: 1.1rem;
            border-radius: 5px;
            transition: all 0.3s ease;
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        @media (max-width: 768px) {
            .hero {
                height: 60vh;
                padding: 50px 10px;
            }
        }
    </style>
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div class="container">
            <a class="navbar-brand" href="#">
                <img src="assets/images/logo.png" alt="SMP Negeri 3 Kalikajar" height="40">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#beranda">Beranda</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#profil">Profil</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#akademik">Akademik</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#kegiatan">Kegiatan</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#ppdb">PPDB</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#kontak">Kontak</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="beranda" class="hero d-flex align-items-center">
        <div class="container">
            <div class="row justify-content-center text-center">
                <div class="col-lg-8">
                    <h1 class="display-4 fw-bold mb-4">SMP Negeri 3 Kalikajar</h1>
                    <p class="lead mb-4">Membangun Generasi Unggul dengan Pendidikan Berkualitas</p>
                    <a href="#ppdb" class="btn btn-primary btn-lg cta-button">Daftar Sekarang</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Profil Section -->
    <section id="profil" class="py-5 bg-light">
        <div class="container">
            <h2 class="text-center mb-5">Profil Sekolah</h2>
            <div class="row">
                <div class="col-lg-6">
                    <h3>Sejarah Singkat</h3>
                    <p>SMP Negeri 3 Kalikajar didirikan pada tahun 1980 dengan tujuan membangun generasi muda yang berilmu dan berkarakter. Sekolah ini telah menghasilkan banyak alumni yang berhasil di berbagai bidang.</p>
                </div>
                <div class="col-lg-6">
                    <h3>Visi dan Misi</h3>
                    <div class="visi">
                        <h4>Visi</h4>
                        <p>Menjadi sekolah unggul yang menghasilkan generasi berkualitas dan berakhlak mulia</p>
                    </div>
                    <div class="misi mt-4">
                        <h4>Misi</h4>
                        <ul>
                            <li>Meningkatkan kualitas pendidikan</li>
                            <li>Mengembangkan karakter siswa</li>
                            <li>Menghasilkan generasi yang berdaya saing</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Akademik Section -->
    <section id="akademik" class="py-5">
        <div class="container">
            <h2 class="text-center mb-5">Akademik</h2>
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">Kurikulum</h5>
                            <p class="card-text">Implementasi Kurikulum 2013 dengan pendekatan saintifik dan pembelajaran berbasis teknologi.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">Ekstrakurikuler</h5>
                            <p class="card-text">Berbagai program ekstrakurikuler seperti Pramuka, Paskibra, dan Olahraga.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">Prestasi</h5>
                            <p class="card-text">Banyak prestasi yang diraih di tingkat kabupaten, provinsi, dan nasional.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Kegiatan Section -->
    <section id="kegiatan" class="py-5 bg-light">
        <div class="container">
            <h2 class="text-center mb-5">Kegiatan Terbaru</h2>
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card h-100">
                        <img src="assets/images/kegiatan1.jpg" class="card-img-top" alt="Kegiatan 1">
                        <div class="card-body">
                            <h5 class="card-title">Pengembangan Kepribadian</h5>
                            <p class="card-text">Program pengembangan karakter siswa melalui berbagai kegiatan.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100">
                        <img src="assets/images/kegiatan2.jpg" class="card-img-top" alt="Kegiatan 2">
                        <div class="card-body">
                            <h5 class="card-title">Prestasi Akademik</h5>
                            <p class="card-text">Prestasi siswa di berbagai bidang akademik dan non-akademik.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100">
                        <img src="assets/images/kegiatan3.jpg" class="card-img-top" alt="Kegiatan 3">
                        <div class="card-body">
                            <h5 class="card-title">Kegiatan Sosial</h5>
                            <p class="card-text">Kegiatan sosial dan gotong royong siswa.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- PPDB Section -->
    <section id="ppdb" class="py-5">
        <div class="container">
            <h2 class="text-center mb-5">PPDB Online</h2>
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-body">
                            <h3 class="card-title">Pendaftaran Online</h3>
                            <p class="card-text">Segera daftarkan diri Anda untuk menjadi bagian dari keluarga besar SMP Negeri 3 Kalikajar.</p>
                            <a href="ppdb/index.php" class="btn btn-primary">Daftar Sekarang</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Kontak Section -->
    <section id="kontak" class="py-5 bg-light">
        <div class="container">
            <h2 class="text-center mb-5">Kontak Kami</h2>
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-body">
                            <h3 class="card-title">Hubungi Kami</h3>
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Alamat:</strong><br>
                                    Jl. Raya Kalikajar No. 123<br>
                                    Kalikajar, Purworejo<br>
                                    Jawa Tengah 54111</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Kontak:</strong><br>
                                    Telp: (0275) 123456<br>
                                    Email: info@smpn3kalikajar.sch.id<br>
                                    Website: smpn3kalikajar.sch.id</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section id="beranda" class="hero">
        <div class="container">
            <h1 class="display-4 mb-4">Selamat Datang di SMP Negeri 3 Kalikajar</h1>
            <p class="lead mb-4">Membangun Generasi Unggul dengan Pendidikan Berkualitas</p>
            <a href="#ppdb" class="btn btn-primary btn-lg cta-button">Daftar PPDB Sekarang</a>
        </div>
    </section>

    <!-- Berita Section -->
    <section class="py-5">
        <div class="container">
            <h2 class="text-center mb-5">Berita Terbaru</h2>
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="card feature-card h-100">
                        <img src="assets/images/berita1.jpg" class="card-img-top" alt="Berita 1">
                        <div class="card-body">
                            <h5 class="card-title">Prestasi Siswa di Lomba Sains</h5>
                            <p class="card-text">Siswa SMPN 3 Kalikajar berhasil meraih juara 1 di lomba sains tingkat kabupaten...</p>
                            <a href="#" class="btn btn-primary">Selengkapnya</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card feature-card h-100">
                        <img src="assets/images/berita2.jpg" class="card-img-top" alt="Berita 2">
                        <div class="card-body">
                            <h5 class="card-title">Pengumuman Kenaikan Kelas</h5>
                            <p class="card-text">Pengumuman kenaikan kelas untuk semester genap tahun ajaran 2023/2024...</p>
                            <a href="#" class="btn btn-primary">Selengkapnya</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card feature-card h-100">
                        <img src="assets/images/berita3.jpg" class="card-img-top" alt="Berita 3">
                        <div class="card-body">
                            <h5 class="card-title">Pembukaan Ekstrakurikuler</h5>
                            <p class="card-text">Pendaftaran ekstrakurikuler tahun ajaran baru sudah dibuka...</p>
                            <a href="#" class="btn btn-primary">Selengkapnya</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-light py-5">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <h5>Kontak Kami</h5>
                    <p><i class="fas fa-map-marker-alt"></i> Jl. Raya Kalikajar, Kalikajar, Wonosobo</p>
                    <p><i class="fas fa-phone"></i> (0286) 123456</p>
                    <p><i class="fas fa-envelope"></i> info@smpn3kalikajar.sch.id</p>
                </div>
                <div class="col-md-4">
                    <h5>Link Cepat</h5>
                    <ul class="list-unstyled">
                        <li><a href="#ppdb">PPDB Online</a></li>
                        <li><a href="#akademik">Kalender Akademik</a></li>
                        <li><a href="#kegiatan">Ekstrakurikuler</a></li>
                        <li><a href="#kontak">Kontak Kami</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h5>Ikuti Kami</h5>
                    <div class="social-links">
                        <a href="#" class="btn btn-outline-primary btn-sm me-2"><i class="fab fa-facebook"></i></a>
                        <a href="#" class="btn btn-outline-primary btn-sm me-2"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="btn btn-outline-primary btn-sm me-2"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="btn btn-outline-primary btn-sm"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
            </div>
            <hr class="my-4">
            <div class="text-center">
                <p class="mb-0">&copy; 2025 SMP Negeri 3 Kalikajar. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
