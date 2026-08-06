<?php
header('Content-Type: application/json');

// Handle preflight CORS requests if needed
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

if (!isset($_FILES['file'])) {
    echo json_encode(['success' => false, 'message' => 'No file uploaded']);
    exit();
}

$file = $_FILES['file'];
$uploadDir = '../public/uploads/';

// Create directory if it doesn't exist
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Generate unique filename to avoid overwriting
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('img_') . '_' . time() . '.' . $extension;
$destination = $uploadDir . $filename;

// Optional flag to overwrite favicon
if (isset($_POST['is_favicon']) && $_POST['is_favicon'] === 'true') {
    $destination = '../public/favicon.ico';
    $filename = 'favicon.ico';
}

if (move_uploaded_file($file['tmp_name'], $destination)) {
    // Return the URL relative to the public root, so frontend can access it
    $url = '/uploads/' . $filename;
    
    if ($filename === 'favicon.ico') {
        $url = '/favicon.ico?' . time(); // cache buster
    }

    echo json_encode([
        'success' => true,
        'url' => $url,
        'message' => 'File uploaded successfully'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to move uploaded file'
    ]);
}
?>
