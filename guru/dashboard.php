<?php
require_once '../includes/config.php';
require_once '../includes/db.php';

// Check if user is logged in and has teacher role
if (!isset($_SESSION['user_id'])) {
    header('Location: ../login.php');
    exit();
}

// Get user's roles
$db = new Database();
$conn = $db->connect();
$stmt = $conn->prepare("SELECT r.id, r.nama_role FROM roles r WHERE r.id IN (SELECT role_id FROM users WHERE id = ?)");
$stmt->execute([$_SESSION['user_id']]);
$roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get current role from session or first role
$current_role = $_SESSION['current_role'] ?? $roles[0]['id'];

// Handle role switch
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['switch_role'])) {
    $new_role = $_POST['role'];
    if (in_array($new_role, array_column($roles, 'id'))) {
        $_SESSION['current_role'] = $new_role;
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit();
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Guru - SMP Negeri 3 Kalikajar</title>
    <link rel="stylesheet" href="https://adminlte.io/themes/v3/dist/css/adminlte.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
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
                <!-- Role Switcher -->
                <li class="nav-item dropdown">
                    <a class="nav-link" data-toggle="dropdown" href="#">
                        <i class="fas fa-user-tag"></i>
                        <span class="badge badge-info"><?= array_search($current_role, array_column($roles, 'id')) + 1 ?>/<?= count($roles) ?></span>
                    </a>
                    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                        <h6 class="dropdown-header">Lihat Sebagai...</h6>
                        <form method="POST" action="">
                            <div class="dropdown-divider"></div>
                            <?php foreach ($roles as $role): ?>
                            <button type="submit" name="switch_role" value="<?= $role['id'] ?>" class="dropdown-item">
                                <i class="fas <?= $role['id'] == $current_role ? 'fa-check-circle text-success' : 'fa-circle' ?>"></i>
                                <?= $role['nama_role'] ?>
                            </button>
                            <div class="dropdown-divider"></div>
                            <?php endforeach; ?>
                        </form>
                    </div>
                </li>
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
                            <a href="dashboard.php" class="nav-link active">
                                <i class="nav-icon fas fa-tachometer-alt"></i>
                                <p>Dashboard</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="kelas.php" class="nav-link">
                                <i class="nav-icon fas fa-chalkboard"></i>
                                <p>Kelas yang Diajar</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="mapel.php" class="nav-link">
                                <i class="nav-icon fas fa-book"></i>
                                <p>Mata Pelajaran</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="absensi.php" class="nav-link">
                                <i class="nav-icon fas fa-calendar-check"></i>
                                <p>Absensi</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="nilai.php" class="nav-link">
                                <i class="nav-icon fas fa-calculator"></i>
                                <p>Nilai Siswa</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="rapor.php" class="nav-link">
                                <i class="nav-icon fas fa-file-alt"></i>
                                <p>Rapor</p>
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
                            <h1 class="m-0">Dashboard</h1>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main content -->
            <section class="content">
                <div class="container-fluid">
                    <!-- Role Information -->
                    <div class="row">
                        <div class="col-12">
                            <div class="alert alert-info alert-dismissible fade show" role="alert">
                                <h5><i class="fas fa-info-circle"></i> Informasi</h5>
                                Anda sedang melihat dashboard sebagai <strong><?= array_filter($roles, function($role) use ($current_role) { return $role['id'] == $current_role; })[0]['nama_role'] ?></strong>
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Class Information -->
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-header">
                                    <h3 class="card-title">Kelas yang Diajar</h3>
                                </div>
                                <div class="card-body">
                                    <!-- Class information will be populated by AJAX -->
                                    <div id="classes-container">
                                        <p>Loading...</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Attendance Information -->
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-header">
                                    <h3 class="card-title">Absensi Hari Ini</h3>
                                </div>
                                <div class="card-body">
                                    <!-- Attendance information will be populated by AJAX -->
                                    <div id="attendance-container">
                                        <p>Loading...</p>
                                    </div>
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
    <!-- Custom Scripts -->
    <script>
    $(document).ready(function() {
        // Load classes based on current role
        function loadClasses() {
            $.ajax({
                url: 'ajax/get_classes.php',
                method: 'GET',
                data: { role_id: <?= $current_role ?> },
                success: function(response) {
                    $('#classes-container').html(response);
                }
            });
        }

        // Load attendance based on current role
        function loadAttendance() {
            $.ajax({
                url: 'ajax/get_attendance.php',
                method: 'GET',
                data: { role_id: <?= $current_role ?> },
                success: function(response) {
                    $('#attendance-container').html(response);
                }
            });
        }

        // Initial load
        loadClasses();
        loadAttendance();
    });
    </script>
</body>
</html>
