<?php
require 'db_config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if(isset($data->nip) && isset($data->name) && isset($data->subject) && isset($data->phone)) {
    $nip = $conn->real_escape_string($data->nip);
    $name = $conn->real_escape_string($data->name);
    $subject = $conn->real_escape_string($data->subject);
    $phone = $conn->real_escape_string($data->phone);

    $sql = "INSERT INTO teachers (nip, name, subject, phone) VALUES ('$nip', '$name', '$subject', '$phone')";

    if ($conn->query($sql) === TRUE) {
        $data->id = $conn->insert_id;
        echo json_encode(array("success" => true, "message" => "Guru berhasil ditambahkan", "data" => $data));
    } else {
        echo json_encode(array("success" => false, "message" => "Error: " . $sql . "<br>" . $conn->error));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Data tidak lengkap"));
}
$conn->close();
?>
