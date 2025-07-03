<?php
require_once '../includes/config.php';
require_once '../includes/db.php';

// Check if user is logged in and has BK role
if (!isset($_SESSION['user_id']) || $_SESSION['role_id'] != 5) {
    header('Location: ../login.php');
    exit();
}

$db = new Database();
$conn = $db->connect();

// Get pending attendance
$stmt = $conn->prepare("SELECT a.*, k.nama_kelas, u.nama_lengkap as ketua_kelas 
                      FROM absensi a 
                      JOIN kelas k ON a.kelas_id = k.id 
                      JOIN users u ON k.ketua_kelas_id = u.id 
                      WHERE a.status_verifikasi = 'pending'
                      ORDER BY a.created_at DESC");
$stmt->execute();
$pending_absensi = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get verified attendance
$stmt = $conn->prepare("SELECT a.*, k.nama_kelas, u.nama_lengkap as ketua_kelas 
                      FROM absensi a 
                      JOIN kelas k ON a.kelas_id = k.id 
                      JOIN users u ON k.ketua_kelas_id = u.id 
                      WHERE a.status_verifikasi != 'pending'
                      ORDER BY a.created_at DESC LIMIT 5");
$stmt->execute();
$verified_absensi = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Handle verification
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    try {
        $conn->beginTransaction();
        
        $absensi_id = $_POST['absensi_id'];
        $action = $_POST['action'];
        $catatan = $_POST['catatan'] ?? '';

        // Update attendance status
        $stmt = $conn->prepare("UPDATE absensi 
                              SET status_verifikasi = ?, 
                                  catatan = ?,
                                  guru_bk_id = ?,
                                  updated_at = NOW()
                              WHERE id = ?");
        $stmt->execute([$action, $catatan, $_SESSION['user_id'], $absensi_id]);

        $conn->commit();
        $success = "Absensi berhasil diverifikasi!";
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
    <title>Verifikasi Absensi - SMP Negeri 3 Kalikajar</title>
    <link rel="stylesheet" href="https://adminlte.io/themes/v3/dist/css/adminlte.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
    <style>
        .attendance-status {
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.9em;
        }
        .status-pending { background-color: #fff3cd; color: #856404; }
        .status-approved { background-color: #d4edda; color: #155724; }
        .status-rejected { background-color: #f8d7da; color: #721c24; }
    </style>
</head>
<body class="hold-transition sidebar-mini">
    <div class="wrapper">
        <!-- Navbar and Sidebar -->
        <?php include 'includes/navbar.php'; ?>
        <?php include 'includes/sidebar.php'; ?>

        <!-- Content Wrapper -->
        <div class="content-wrapper">
            <!-- Content Header -->
            <div class="content-header">
                <div class="container-fluid">
                    <div class="row mb-2">
                        <div class="col-sm-6">
                            <h1 class="m-0">Verifikasi Absensi</h1>
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

                    <!-- Pending Attendance -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Absensi Menunggu Verifikasi</h3>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>Kelas</th>
                                            <th>Ketua Kelas</th>
                                            <th>Tanggal</th>
                                            <th>Status</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($pending_absensi as $item): ?>
                                        <tr>
                                            <td><?= htmlspecialchars($item['nama_kelas']) ?></td>
                                            <td><?= htmlspecialchars($item['ketua_kelas']) ?></td>
                                            <td><?= date('d M Y', strtotime($item['tanggal'])) ?></td>
                                            <td>
                                                <span class="attendance-status status-pending">
                                                    <?= ucfirst($item['status_verifikasi']) ?>
                                                </span>
                                            </td>
                                            <td>
                                                <button type="button" class="btn btn-sm btn-primary" 
                                                        data-toggle="modal" 
                                                        data-target="#verifyModal" 
                                                        data-id="<?= $item['id'] ?>">
                                                    Verifikasi
                                                </button>
                                            </td>
                                        </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Verified Attendance -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Absensi Terakhir yang Diverifikasi</h3>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>Kelas</th>
                                            <th>Ketua Kelas</th>
                                            <th>Tanggal</th>
                                            <th>Status</th>
                                            <th>Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($verified_absensi as $item): ?>
                                        <tr>
                                            <td><?= htmlspecialchars($item['nama_kelas']) ?></td>
                                            <td><?= htmlspecialchars($item['ketua_kelas']) ?></td>
                                            <td><?= date('d M Y', strtotime($item['tanggal'])) ?></td>
                                            <td>
                                                <span class="attendance-status status-<?= $item['status_verifikasi'] ?>">
                                                    <?= ucfirst($item['status_verifikasi']) ?>
                                                </span>
                                            </td>
                                            <td><?= htmlspecialchars($item['catatan']) ?></td>
                                        </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Verification Modal -->
        <div class="modal fade" id="verifyModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Verifikasi Absensi</h5>
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>
                    <form method="POST" action="">
                        <div class="modal-body">
                            <input type="hidden" name="absensi_id" id="absensiId">
                            <div class="form-group">
                                <label>Status</label>
                                <select class="form-control" name="action" required>
                                    <option value="approved">Setujui</option>
                                    <option value="rejected">Tolak</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Keterangan</label>
                                <textarea class="form-control" name="catatan" rows="3"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
                            <button type="submit" class="btn btn-primary">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
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
    <script>
    $(document).ready(function() {
        // Handle modal show event
        $('#verifyModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var id = button.data('id');
            var modal = $(this);
            modal.find('#absensiId').val(id);
        });
    });
    </script>
</body>
</html>
