<?php
require 'db_config.php';

header('Content-Type: application/json');

$sql = "SELECT section_key, content_value FROM page_content";
$result = $conn->query($sql);

$content = array();
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $content[$row['section_key']] = $row['content_value'];
    }
}

echo json_encode($content);
$conn->close();
?>
