<?php
require 'db_config.php';

header('Content-Type: application/json');

$class = isset($_GET['class']) ? $conn->real_escape_string($_GET['class']) : '';
$date = isset($_GET['date']) ? $conn->real_escape_string($_GET['date']) : date('Y-m-d');

$sql = "SELECT a.id, a.student_id, a.date, a.status, a.confirmation_status, s.name as student_name, s.class as class_name 
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE a.confirmation_status = 'Submitted'";

if ($class !== '') {
    $sql .= " AND s.class = '$class'";
}
if ($date !== '') {
    $sql .= " AND a.date = '$date'";
}

$result = $conn->query($sql);

$attendance = array();
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $attendance[] = $row;
    }
}

echo json_encode($attendance);
$conn->close();
?>
