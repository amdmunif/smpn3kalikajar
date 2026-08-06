<?php
require 'db_config.php';

header('Content-Type: application/json');

$class = isset($_GET['class']) ? $conn->real_escape_string($_GET['class']) : '';

if($class !== '') {
    $sql = "SELECT id, nisn, name, class, gender, entry_year as entryYear FROM students WHERE class='$class' ORDER BY name ASC";
    $result = $conn->query($sql);

    $students = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $students[] = $row;
        }
    }

    echo json_encode($students);
} else {
    echo json_encode(array());
}
$conn->close();
?>
