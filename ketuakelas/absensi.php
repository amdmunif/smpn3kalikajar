<?php
require_once '../includes/config.php';
require_once '../includes/db.php';

// Check if user is logged in and has class leader role
if (!isset($_SESSION['user_id']) || $_SESSION['role_id'] != 4) {
    header('Location: ../login.php');
    exit();
}

$db = new Database();
$conn = $db->connect();

// Get the class managed by this ketua kelas
$stmt = $conn->prepare("SELECT * FROM kelas WHERE ketua_kelas_id = ?");
$stmt->execute([$_SESSION['user_id']]);
$kelas = $stmt->fetch(PDO::FETCH_ASSOC);

// Get today's attendance
$tanggal = date('Y-m-d');
$stmt = $conn->prepare("SELECT * FROM absensi WHERE kelas_id = ? AND tanggal = ?");
$stmt->execute([$kelas['id'], $tanggal]);
$absensi = $stmt->fetch(PDO::FETCH_ASSOC);

// Get all students in the class
$stmt = $conn->prepare("SELECT * FROM users WHERE role_id = 3 AND id IN (SELECT siswa_id FROM absensi_detail WHERE kelas_id = ?)");
$stmt->execute([$kelas['id']]);
$siswa = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Handle attendance submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $conn->beginTransaction();
        
        // If attendance doesn't exist, create new one
        if (!$absensi) {
            $stmt = $conn->prepare("INSERT INTO absensi (tanggal, kelas_id, status_verifikasi) VALUES (?, ?, 'pending')");
            $stmt->execute([$tanggal, $kelas['id']]);
            $absensi_id = $conn->lastInsertId();
        } else {
            $absensi_id = $absensi['id'];
        }

        // Update attendance details
        foreach ($siswa as $s) {
            $status = $_POST['status_' . $s['id']] ?? 'alpha';
            $keterangan = $_POST['keterangan_' . $s['id']] ?? '';

            $stmt = $conn->prepare("INSERT INTO absensi_detail (absensi_id, siswa_id, status, keterangan) 
                                  VALUES (?, ?, ?, ?) 
                                  ON DUPLICATE KEY UPDATE status = VALUES(status), keterangan = VALUES(keterangan)");
            $stmt->execute([$absensi_id, $s['id'], $status, $keterangan]);
        }

        $conn->commit();
        $success = "Absensi berhasil disimpan!";
    } catch (PDOException $e) {
        $conn->rollBack();
        $error = "Terjadi kesalahan: " . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Absensi Kelas - SMP Negeri 3 Kalikajar</title>
    <link rel="stylesheet" href="https://adminlte.io/themes/v3/dist/css/adminlte.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
    <style>
        .attendance-card {
            margin-bottom: 20px;
        }
        .attendance-status {
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.9em;
        }
        .status-hadir { background-color: #d4edda; color: #155724; }
        .status-izin { background-color: #fff3cd; color: #856404; }
        .status-sakit { background-color: #cce5ff; color: #004085; }
        .status-alpha { background-color: #f8d7da; color: #721c24; }
    </style>
</head>
<body class="hold-transition sidebar-mini">
    <div class="wrapper">
        <!-- Navbar -->
        <nav class="main-header navbar navbar-expand navbar-white navbar-light">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                </li>
            </ul>
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a class="nav-link" href="../logout.php">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </a>
                </li>
            </ul>
        </nav>

        <!-- Main Sidebar Container -->
        <aside class="main-sidebar sidebar-dark-primary elevation-4">
            <a href="dashboard.php" class="brand-link">
                <img src="../assets/images/logo.png" alt="SMPN 3 Logo" class="brand-image img-circle elevation-3" style="opacity: .8">
                <span class="brand-text font-weight-light">SMPN 3 Kalikajar</span>
            </a>

            <div class="sidebar">
                <nav class="mt-2">
                    <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <li class="nav-item">
                            <a href="dashboard.php" class="nav-link">
                                <i class="nav-icon fas fa-tachometer-alt"></i>
                                <p>Dashboard</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="absensi.php" class="nav-link active">
                                <i class="nav-icon fas fa-calendar-check"></i>
                                <p>Absensi</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="riwayat.php" class="nav-link">
                                <i class="nav-icon fas fa-history"></i>
                                <p>Riwayat Absensi</p>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>

        <!-- Content Wrapper -->
        <div class="content-wrapper">
            <!-- Content Header -->
            <div class="content-header">
                <div class="container-fluid">
                    <div class="row mb-2">
                        <div class="col-sm-6">
                            <h1 class="m-0">Absensi Kelas</h1>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main content -->
            <section class="content">
                <div class="container-fluid">
                    <?php if (isset($success)): ?>
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <?= htmlspecialchars($success) ?>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <?php endif; ?>

                    <?php if (isset($error)): ?>
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <?= htmlspecialchars($error) ?>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <?php endif; ?>

                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Absensi Kelas <?= htmlspecialchars($kelas['nama_kelas']) ?></h3>
                        </div>
                        <div class="card-body">
                            <form method="POST" action="">
                                <div class="row">
                                    <?php foreach ($siswa as $s): ?>
                                    <div class="col-md-4 attendance-card">
                                        <div class="card">
                                            <div class="card-body">
                                                <h5 class="card-title"><?= htmlspecialchars($s['nama_lengkap']) ?></h5>
                                                <div class="form-group">
                                                    <label>Status</label>
                                                    <select name="status_<?= $s['id'] ?>" class="form-control" required>
                                                        <option value="hadir" <?= $absensi ? ($absensi['status'] == 'hadir' ? 'selected' : '') : '' ?>>Hadir</option>
                                                        <option value="izin" <?= $absensi ? ($absensi['status'] == 'izin' ? 'selected' : '') : '' ?>>Izin</option>
                                                        <option value="sakit" <?= $absensi ? ($absensi['status'] == 'sakit' ? 'selected' : '') : '' ?>>Sakit</option>
                                                        <option value="alpha" <?= $absensi ? ($absensi['status'] == 'alpha' ? 'selected' : '') : '' ?>>Alpha</option>
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label>Keterangan</label>
                                                    <textarea name="keterangan_<?= $s['id'] ?>" class="form-control" rows="2"><?= $absensi ? htmlspecialchars($absensi['keterangan']) : '' ?></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <?php endforeach; ?>
                                </div>
                                <div class="mt-3">
                                    <button type="submit" class="btn btn-primary">Simpan Absensi</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Attendance Summary -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Ringkasan Absensi</h3>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-3">
                                    <span class="attendance-status status-hadir">Hadir: <?= $absensi ? array_sum(array_map(function($d) { return $d['status'] == 'hadir' ? 1 : 0; }, $absensi_detail)) : 0 ?></span>
                                </div>
                                <div class="col-md-3">
                                    <span class="attendance-status status-izin">Izin: <?= $absensi ? array_sum(array_map(function($d) { return $d['status'] == 'izin' ? 1 : 0; }, $absensi_detail)) : 0 ?></span>
                                </div>
                                <div class="col-md-3">
                                    <span class="attendance-status status-sakit">Sakit: <?= $absensi ? array_sum(array_map(function($d) { return $d['status'] == 'sakit' ? 1 : 0; }, $absensi_detail)) : 0 ?></span>
                                </div>
                                <div class="col-md-3">
                                    <span class="attendance-status status-alpha">Alpha: <?= $absensi ? array_sum(array_map(function($d) { return $d['status'] == 'alpha' ? 1 : 0; }, $absensi_detail)) : 0 ?></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Control Sidebar -->
        <aside class="control-sidebar control-sidebar-dark"></aside>
    </div>

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Bootstrap 4 -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- AdminLTE App -->
    <script src="https://adminlte.io/themes/v3/dist/js/adminlte.min.js"></script>
</body>
</html>
