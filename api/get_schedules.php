<?php
require 'db_config.php';

header('Content-Type: application/json');

$sql = "SELECT id, day, TIME_FORMAT(time_start, '%H:%i') as time_start, TIME_FORMAT(time_end, '%H:%i') as time_end, subject, class_name, teacher_name FROM schedules ORDER BY FIELD(day, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'), time_start ASC";
$result = $conn->query($sql);

$schedules = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $schedules[] = $row;
    }
}

echo json_encode($schedules);
$conn->close();
?>
