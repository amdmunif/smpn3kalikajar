<?php
require 'db_config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if(isset($data->id) && isset($data->nip) && isset($data->name) && isset($data->subject) && isset($data->phone)) {
    $id = (int)$data->id;
    $nip = $conn->real_escape_string($data->nip);
    $name = $conn->real_escape_string($data->name);
    $subject = $conn->real_escape_string($data->subject);
    $phone = $conn->real_escape_string($data->phone);

    $sql = "UPDATE teachers SET nip='$nip', name='$name', subject='$subject', phone='$phone' WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(array("success" => true, "message" => "Data guru berhasil diperbarui", "data" => $data));
    } else {
        echo json_encode(array("success" => false, "message" => "Error updating record: " . $conn->error));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Data tidak lengkap"));
}
$conn->close();
?>
