<?php
require 'db_config.php';

header('Content-Type: application/json');

$sql = "SELECT id, nisn, name, class, gender, entry_year as entryYear FROM students ORDER BY id DESC";
$result = $conn->query($sql);

$students = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $students[] = $row;
    }
}

echo json_encode($students);
$conn->close();
?>
