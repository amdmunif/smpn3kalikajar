<?php
require 'db_config.php';

header('Content-Type: application/json');

$sql = "SELECT id, nip, name, subject, phone FROM teachers ORDER BY id DESC";
$result = $conn->query($sql);

$teachers = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $teachers[] = $row;
    }
}

echo json_encode($teachers);
$conn->close();
?>
