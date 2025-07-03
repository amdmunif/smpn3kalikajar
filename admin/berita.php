<?php
require_once '../includes/config.php';
require_once '../includes/db.php';

// Check if user is logged in and has admin role
if (!isset($_SESSION['user_id']) || $_SESSION['role_id'] != 1) {
    header('Location: ../login.php');
    exit();
}

$db = new Database();
$conn = $db->connect();

// Handle news submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $conn->beginTransaction();
        
        // Validate and sanitize input
        $data = [
            'judul' => htmlspecialchars($_POST['judul']),
            'isi' => $_POST['isi'],
            'penulis_id' => $_SESSION['user_id']
        ];

        // Handle image upload
        if (isset($_FILES['gambar']) && $_FILES['gambar']['error'] === 0) {
            $file = $_FILES['gambar'];
            $fileName = uniqid() . '_' . basename($file['name']);
            $targetPath = '../uploads/berita/' . $fileName;
            
            if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                $data['gambar'] = $fileName;
            } else {
                throw new Exception('Gagal mengunggah gambar');
            }
        }

        // Insert data
        $stmt = $conn->prepare("INSERT INTO berita (judul, isi, gambar, penulis_id) 
                              VALUES (:judul, :isi, :gambar, :penulis_id)");
        $stmt->execute($data);

        $conn->commit();
        $success = "Berita berhasil diposting!";
    } catch (Exception $e) {
        $conn->rollBack();
        $error = $e->getMessage();
    }
}

// Get all news
$stmt = $conn->query("SELECT b.*, u.nama_lengkap as penulis 
                      FROM berita b 
                      JOIN users u ON b.penulis_id = u.id 
                      ORDER BY b.created_at DESC");
$berita = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>News Management - SMP Negeri 3 Kalikajar</title>
    <link rel="stylesheet" href="https://adminlte.io/themes/v3/dist/css/adminlte.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/dataTables.bootstrap4.min.css">
    <style>
        .news-item {
            margin-bottom: 20px;
        }
        .news-thumbnail {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 5px;
        }
        .news-actions {
            display: flex;
            gap: 10px;
        }
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
                            <h1 class="m-0">Berita</h1>
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
                            <h3 class="card-title">Tambah Berita</h3>
                        </div>
                        <div class="card-body">
                            <form method="POST" action="" enctype="multipart/form-data">
                                <div class="form-group">
                                    <label>Judul</label>
                                    <input type="text" class="form-control" name="judul" required>
                                </div>
                                <div class="form-group">
                                    <label>Isi Berita</label>
                                    <textarea class="form-control" name="isi" rows="5" required></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Gambar</label>
                                    <div class="custom-file">
                                        <input type="file" class="custom-file-input" name="gambar">
                                        <label class="custom-file-label">Pilih gambar...</label>
                                    </div>
                                    <small class="form-text text-muted">Max 5MB, format: JPG, PNG</small>
                                </div>
                                <button type="submit" class="btn btn-primary">Publikasikan</button>
                            </form>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Daftar Berita</h3>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-striped table-hover" id="beritaTable">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Judul</th>
                                            <th>Penulis</th>
                                            <th>Tanggal</th>
                                            <th>Gambar</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($berita as $index => $item): ?>
                                        <tr>
                                            <td><?= $index + 1 ?></td>
                                            <td><?= htmlspecialchars($item['judul']) ?></td>
                                            <td><?= htmlspecialchars($item['penulis']) ?></td>
                                            <td><?= date('d M Y', strtotime($item['created_at'])) ?></td>
                                            <td>
                                                <?php if ($item['gambar']): ?>
                                                <img src="../uploads/berita/<?= htmlspecialchars($item['gambar']) ?>" 
                                                     class="img-thumbnail" 
                                                     style="max-width: 100px;">
                                                <?php endif; ?>
                                            </td>
                                            <td>
                                                <div class="news-actions">
                                                    <a href="edit_berita.php?id=<?= $item['id'] ?>" class="btn btn-sm btn-warning">
                                                        <i class="fas fa-edit"></i>
                                                    </a>
                                                    <button type="button" class="btn btn-sm btn-danger" onclick="confirmDelete('<?= $item['id'] ?>')">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
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

        <!-- Control Sidebar -->
        <aside class="control-sidebar control-sidebar-dark"></aside>
    </div>

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Bootstrap 4 -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- AdminLTE App -->
    <script src="https://adminlte.io/themes/v3/dist/js/adminlte.min.js"></script>
    <!-- DataTables -->
    <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.11.5/js/dataTables.bootstrap4.min.js"></script>
    <script>
    $(document).ready(function() {
        $('#beritaTable').DataTable({
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/id.json"
            }
        });
    });

    function confirmDelete(id) {
        if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
            window.location.href = 'delete_berita.php?id=' + id;
        }
    }
    </script>
</body>
</html>
