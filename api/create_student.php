<?php
require 'db_config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if(isset($data->nisn) && isset($data->name) && isset($data->class) && isset($data->gender) && isset($data->entryYear)) {
    $nisn = $conn->real_escape_string($data->nisn);
    $name = $conn->real_escape_string($data->name);
    $class = $conn->real_escape_string($data->class);
    $gender = $conn->real_escape_string($data->gender);
    $entryYear = (int)$data->entryYear;

    $sql = "INSERT INTO students (nisn, name, class, gender, entry_year) VALUES ('$nisn', '$name', '$class', '$gender', $entryYear)";

    if ($conn->query($sql) === TRUE) {
        $data->id = $conn->insert_id;
        echo json_encode(array("success" => true, "message" => "Siswa berhasil ditambahkan", "data" => $data));
    } else {
        echo json_encode(array("success" => false, "message" => "Error: " . $sql . "<br>" . $conn->error));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Data tidak lengkap"));
}
$conn->close();
?>
