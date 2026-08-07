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

// Override headmaster name and photo from the teachers table if available
$sql_teacher = "SELECT name, photo_url FROM teachers WHERE position='Kepala Sekolah' LIMIT 1";
$res_teacher = $conn->query($sql_teacher);
if ($res_teacher && $res_teacher->num_rows > 0) {
    $teacher = $res_teacher->fetch_assoc();
    $content['headmaster_name'] = $teacher['name'];
    if (!empty($teacher['photo_url'])) {
        $content['headmaster_photo'] = $teacher['photo_url'];
    }
}

echo json_encode($content);
$conn->close();
?>
