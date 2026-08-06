<?php
require 'db_config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if(isset($data->id)) {
    $id = (int)$data->id;

    $sql = "DELETE FROM students WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(array("success" => true, "message" => "Data siswa berhasil dihapus"));
    } else {
        echo json_encode(array("success" => false, "message" => "Error deleting record: " . $conn->error));
    }
} else if (isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $sql = "DELETE FROM students WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(array("success" => true, "message" => "Data siswa berhasil dihapus"));
    } else {
        echo json_encode(array("success" => false, "message" => "Error deleting record: " . $conn->error));
    }
} else {
    echo json_encode(array("success" => false, "message" => "ID tidak diberikan"));
}
$conn->close();
?>
