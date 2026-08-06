<?php
require 'db_config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

// Expected input: array of attendance records
if(is_array($data)) {
    $successCount = 0;
    $errors = array();

    foreach($data as $record) {
        if(isset($record->student_id) && isset($record->date) && isset($record->status)) {
            $student_id = (int)$record->student_id;
            $date = $conn->real_escape_string($record->date);
            $status = $conn->real_escape_string($record->status);
            
            // Check if record already exists for today
            $checkSql = "SELECT id FROM attendance WHERE student_id=$student_id AND date='$date'";
            $checkResult = $conn->query($checkSql);
            
            if ($checkResult && $checkResult->num_rows > 0) {
                // Update existing
                $existing = $checkResult->fetch_assoc();
                $id = $existing['id'];
                $sql = "UPDATE attendance SET status='$status', confirmation_status='Submitted' WHERE id=$id";
            } else {
                // Insert new
                $sql = "INSERT INTO attendance (student_id, date, status, confirmation_status) VALUES ($student_id, '$date', '$status', 'Submitted')";
            }

            if ($conn->query($sql) === TRUE) {
                $successCount++;
            } else {
                $errors[] = $conn->error;
            }
        }
    }

    if(count($errors) == 0) {
        echo json_encode(array("success" => true, "message" => "$successCount absensi berhasil disubmit"));
    } else {
        echo json_encode(array("success" => false, "message" => "Beberapa data gagal disubmit", "errors" => $errors));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Data tidak valid. Harus berupa array."));
}
$conn->close();
?>
