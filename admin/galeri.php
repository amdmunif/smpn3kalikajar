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

// Handle file upload and form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $conn->beginTransaction();
        
        // Validate and sanitize input
        $data = [
            'judul' => htmlspecialchars($_POST['judul']),
            'deskripsi' => htmlspecialchars($_POST['deskripsi']),
            'kategori' => $_POST['kategori']
        ];

        // Handle image upload
        if (isset($_FILES['gambar']) && $_FILES['gambar']['error'] === 0) {
            $file = $_FILES['gambar'];
            $fileName = uniqid() . '_' . basename($file['name']);
            $targetPath = '../uploads/galeri/' . $fileName;
            
            if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                $data['gambar'] = $fileName;
            } else {
                throw new Exception('Gagal mengunggah gambar');
            }
        }

        // Insert data
        $stmt = $conn->prepare("INSERT INTO galeri (judul, deskripsi, gambar, kategori) 
                              VALUES (:judul, :deskripsi, :gambar, :kategori)");
        $stmt->execute($data);

        $conn->commit();
        $success = "Foto berhasil ditambahkan!";
    } catch (Exception $e) {
        $conn->rollBack();
        $error = $e->getMessage();
    }
}

// Get all gallery items
$stmt = $conn->query("SELECT * FROM galeri ORDER BY created_at DESC");
$galeri = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gallery Management - SMP Negeri 3 Kalikajar</title>
    <link rel="stylesheet" href="https://adminlte.io/themes/v3/dist/css/adminlte.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/dataTables.bootstrap4.min.css">
    <style>
        .gallery-item {
            position: relative;
            margin-bottom: 15px;
        }
        .gallery-item img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 5px;
        }
        .gallery-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .gallery-item:hover .gallery-overlay {
            opacity: 1;
        }
        .gallery-actions {
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
                            <h1 class="m-0">Galeri</h1>
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
                            <h3 class="card-title">Tambah Foto</h3>
                        </div>
                        <div class="card-body">
                            <form method="POST" action="" enctype="multipart/form-data">
                                <div class="form-group">
                                    <label>Judul</label>
                                    <input type="text" class="form-control" name="judul" required>
                                </div>
                                <div class="form-group">
                                    <label>Deskripsi</label>
                                    <textarea class="form-control" name="deskripsi" rows="3"></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Kategori</label>
                                    <select class="form-control" name="kategori" required>
                                        <option value="kegiatan">Kegiatan</option>
                                        <option value="prestasi">Prestasi</option>
                                        <option value="ekskul">Ekstrakurikuler</option>
                                        <option value="lainnya">Lainnya</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Gambar</label>
                                    <div class="custom-file">
                                        <input type="file" class="custom-file-input" name="gambar" required>
                                        <label class="custom-file-label">Pilih gambar...</label>
                                    </div>
                                    <small class="form-text text-muted">Max 5MB, format: JPG, PNG</small>
                                </div>
                                <button type="submit" class="btn btn-primary">Simpan</button>
                            </form>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Daftar Foto</h3>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <?php foreach ($galeri as $item): ?>
                                <div class="col-md-4 gallery-item">
                                    <div class="card">
                                        <img src="../uploads/galeri/<?= htmlspecialchars($item['gambar']) ?>" class="card-img-top">
                                        <div class="gallery-overlay">
                                            <div class="gallery-actions">
                                                <a href="edit_galeri.php?id=<?= $item['id'] ?>" class="btn btn-sm btn-warning">
                                                    <i class="fas fa-edit"></i>
                                                </a>
                                                <button type="button" class="btn btn-sm btn-danger" onclick="confirmDelete('<?= $item['id'] ?>')">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <h5 class="card-title"><?= htmlspecialchars($item['judul']) ?></h5>
                                            <p class="card-text"><?= htmlspecialchars($item['deskripsi']) ?></p>
                                            <p class="card-text">
                                                <small class="text-muted">
                                                    Kategori: <?= ucfirst(htmlspecialchars($item['kategori'])) ?>
                                                </small>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <?php endforeach; ?>
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
    function confirmDelete(id) {
        if (confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
            window.location.href = 'delete_galeri.php?id=' + id;
        }
    }
    </script>
</body>
</html>
