<?php
require 'db_config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if(isset($data->id)) {
    $id = (int)$data->id;

    $sql = "UPDATE attendance SET confirmation_status='Confirmed' WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(array("success" => true, "message" => "Absensi berhasil dikonfirmasi"));
    } else {
        echo json_encode(array("success" => false, "message" => "Error updating record: " . $conn->error));
    }
} else {
    echo json_encode(array("success" => false, "message" => "ID tidak diberikan"));
}
$conn->close();
?>
