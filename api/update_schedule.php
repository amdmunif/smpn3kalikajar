<?php
require 'db_config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if(isset($data->id) && isset($data->day) && isset($data->time_start) && isset($data->time_end) && isset($data->subject) && isset($data->class_name) && isset($data->teacher_name)) {
    $id = (int)$data->id;
    $day = $conn->real_escape_string($data->day);
    $time_start = $conn->real_escape_string($data->time_start);
    $time_end = $conn->real_escape_string($data->time_end);
    $subject = $conn->real_escape_string($data->subject);
    $class_name = $conn->real_escape_string($data->class_name);
    $teacher_name = $conn->real_escape_string($data->teacher_name);

    $sql = "UPDATE schedules SET day='$day', time_start='$time_start', time_end='$time_end', subject='$subject', class_name='$class_name', teacher_name='$teacher_name' WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(array("success" => true, "message" => "Data jadwal berhasil diperbarui", "data" => $data));
    } else {
        echo json_encode(array("success" => false, "message" => "Error updating record: " . $conn->error));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Data tidak lengkap"));
}
$conn->close();
?>
