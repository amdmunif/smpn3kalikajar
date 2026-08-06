<?php
require 'db_config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if(isset($data->id) && isset($data->nisn) && isset($data->name) && isset($data->class) && isset($data->gender) && isset($data->entryYear)) {
    $id = (int)$data->id;
    $nisn = $conn->real_escape_string($data->nisn);
    $name = $conn->real_escape_string($data->name);
    $class = $conn->real_escape_string($data->class);
    $gender = $conn->real_escape_string($data->gender);
    $entryYear = (int)$data->entryYear;

    $sql = "UPDATE students SET nisn='$nisn', name='$name', class='$class', gender='$gender', entry_year=$entryYear WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(array("success" => true, "message" => "Data siswa berhasil diperbarui", "data" => $data));
    } else {
        echo json_encode(array("success" => false, "message" => "Error updating record: " . $conn->error));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Data tidak lengkap"));
}
$conn->close();
?>
