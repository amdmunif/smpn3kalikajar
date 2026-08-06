<?php
require 'db_config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if(isset($data->day) && isset($data->time_start) && isset($data->time_end) && isset($data->subject) && isset($data->class_name) && isset($data->teacher_name)) {
    $day = $conn->real_escape_string($data->day);
    $time_start = $conn->real_escape_string($data->time_start);
    $time_end = $conn->real_escape_string($data->time_end);
    $subject = $conn->real_escape_string($data->subject);
    $class_name = $conn->real_escape_string($data->class_name);
    $teacher_name = $conn->real_escape_string($data->teacher_name);

    $sql = "INSERT INTO schedules (day, time_start, time_end, subject, class_name, teacher_name) VALUES ('$day', '$time_start', '$time_end', '$subject', '$class_name', '$teacher_name')";

    if ($conn->query($sql) === TRUE) {
        $data->id = $conn->insert_id;
        echo json_encode(array("success" => true, "message" => "Jadwal berhasil ditambahkan", "data" => $data));
    } else {
        echo json_encode(array("success" => false, "message" => "Error: " . $sql . "<br>" . $conn->error));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Data tidak lengkap"));
}
$conn->close();
?>
