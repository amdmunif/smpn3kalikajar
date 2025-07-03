<?php
require_once '../includes/config.php';
require_once '../includes/db.php';

$db = new Database();
$conn = $db->connect();

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $conn->beginTransaction();
        
        // Validate and sanitize input
        $data = [
            'nama_lengkap' => htmlspecialchars($_POST['nama_lengkap']),
            'nisn' => htmlspecialchars($_POST['nisn']),
            'tempat_lahir' => htmlspecialchars($_POST['tempat_lahir']),
            'tanggal_lahir' => $_POST['tanggal_lahir'],
            'jenis_kelamin' => $_POST['jenis_kelamin'],
            'agama' => htmlspecialchars($_POST['agama']),
            'alamat' => htmlspecialchars($_POST['alamat']),
            'nama_sekolah_asal' => htmlspecialchars($_POST['nama_sekolah_asal']),
            'nilai_rapor' => floatval($_POST['nilai_rapor'])
        ];

        // Insert data
        $stmt = $conn->prepare("INSERT INTO ppdb (nama_lengkap, nisn, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, alamat, nama_sekolah_asal, nilai_rapor) 
                              VALUES (:nama_lengkap, :nisn, :tempat_lahir, :tanggal_lahir, :jenis_kelamin, :agama, :alamat, :nama_sekolah_asal, :nilai_rapor)");
        $stmt->execute($data);

        $conn->commit();
        $success = "Pendaftaran berhasil! Silakan simpan nomor pendaftaran Anda: " . $conn->lastInsertId();
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
    <title>PPDB Online - SMP Negeri 3 Kalikajar</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .ppdb-container {
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 10px;
        }
        .ppdb-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .ppdb-header img {
            width: 150px;
            height: 150px;
            object-fit: contain;
            margin-bottom: 20px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-control:focus {
            border-color: #0d6efd;
            box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }
        .btn-primary {
            background-color: #0d6efd;
            border-color: #0d6efd;
            padding: 12px 30px;
            font-weight: 500;
        }
        .btn-primary:hover {
            background-color: #0b5ed7;
            border-color: #0a58ca;
        }
        .error-message {
            color: #dc3545;
            margin-top: 10px;
            text-align: center;
        }
        .success-message {
            color: #198754;
            margin-top: 10px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="ppdb-container">
        <div class="ppdb-header">
            <img src="../assets/images/logo.png" alt="SMPN 3 Kalikajar">
            <h2>Pendaftaran Peserta Didik Baru</h2>
            <p>SMP Negeri 3 Kalikajar</p>
        </div>

        <?php if (isset($error)): ?>
        <div class="alert alert-danger">
            <?= htmlspecialchars($error) ?>
        </div>
        <?php endif; ?>

        <?php if (isset($success)): ?>
        <div class="alert alert-success">
            <h4 class="alert-heading">Pendaftaran Berhasil!</h4>
            <p><?= htmlspecialchars($success) ?></p>
            <hr>
            <p class="mb-0">Silakan simpan nomor pendaftaran ini untuk proses verifikasi selanjutnya.</p>
        </div>
        <?php else: ?>
        <form method="POST" action="" enctype="multipart/form-data">
            <div class="form-group">
                <label for="nama_lengkap">Nama Lengkap</label>
                <input type="text" class="form-control" id="nama_lengkap" name="nama_lengkap" required>
            </div>

            <div class="form-group">
                <label for="nisn">NISN</label>
                <input type="text" class="form-control" id="nisn" name="nisn" required>
            </div>

            <div class="form-row">
                <div class="form-group col-md-6">
                    <label for="tempat_lahir">Tempat Lahir</label>
                    <input type="text" class="form-control" id="tempat_lahir" name="tempat_lahir" required>
                </div>
                <div class="form-group col-md-6">
                    <label for="tanggal_lahir">Tanggal Lahir</label>
                    <input type="date" class="form-control" id="tanggal_lahir" name="tanggal_lahir" required>
                </div>
            </div>

            <div class="form-group">
                <label for="jenis_kelamin">Jenis Kelamin</label>
                <select class="form-control" id="jenis_kelamin" name="jenis_kelamin" required>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                </select>
            </div>

            <div class="form-group">
                <label for="agama">Agama</label>
                <select class="form-control" id="agama" name="agama" required>
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                </select>
            </div>

            <div class="form-group">
                <label for="alamat">Alamat</label>
                <textarea class="form-control" id="alamat" name="alamat" rows="3" required></textarea>
            </div>

            <div class="form-group">
                <label for="nama_sekolah_asal">Nama Sekolah Asal</label>
                <input type="text" class="form-control" id="nama_sekolah_asal" name="nama_sekolah_asal" required>
            </div>

            <div class="form-group">
                <label for="nilai_rapor">Nilai Rapor Rata-rata</label>
                <input type="number" step="0.01" min="0" max="100" class="form-control" id="nilai_rapor" name="nilai_rapor" required>
            </div>

            <div class="form-group">
                <label for="berkas">Upload Berkas (PDF/DOCX)</label>
                <div class="custom-file">
                    <input type="file" class="custom-file-input" id="berkas" name="berkas[]" multiple accept=".pdf,.docx">
                    <label class="custom-file-label" for="berkas">Pilih berkas...</label>
                </div>
                <small class="form-text text-muted">Max 5MB per file</small>
            </div>

            <div class="text-center">
                <button type="submit" class="btn btn-primary">Daftar</button>
            </div>
        </form>
        <?php endif; ?>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Update custom file input label
        document.getElementById('berkas').addEventListener('change', function() {
            var fileName = '';
            var files = this.files;
            if(files.length > 1) {
                fileName = (files.length - 1) + ' files selected';
            } else {
                fileName = files[0].name;
            }
            this.nextElementSibling.innerText = fileName;
        });
    </script>
</body>
</html>
