<?php
require 'db_config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if(is_array($data)) {
    $success = true;
    foreach($data as $key => $value) {
        $k = $conn->real_escape_string($key);
        $v = $conn->real_escape_string($value);
        
        $sql = "INSERT INTO page_content (section_key, content_value) VALUES ('$k', '$v') ON DUPLICATE KEY UPDATE content_value='$v'";
        if ($conn->query($sql) !== TRUE) {
            $success = false;
        }
    }

    if ($success) {
        echo json_encode(array("success" => true, "message" => "Konten berhasil diperbarui"));
    } else {
        echo json_encode(array("success" => false, "message" => "Ada kesalahan saat memperbarui konten"));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Data tidak valid"));
}
$conn->close();
?>
