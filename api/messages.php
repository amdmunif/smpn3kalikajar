<?php
require 'db_config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM messages ORDER BY created_at DESC";
        $result = $conn->query($sql);
        $messages = array();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $messages[] = $row;
            }
        }
        echo json_encode($messages);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        // Update status
        if (isset($data->id) && isset($data->status)) {
            $id = (int)$data->id;
            $status = $conn->real_escape_string($data->status);
            $sql = "UPDATE messages SET status='$status' WHERE id=$id";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(array("success" => true, "message" => "Status pesan diperbarui"));
            } else {
                echo json_encode(array("success" => false, "message" => "Error: " . $conn->error));
            }
            break;
        }

        // Create new message
        if(isset($data->sender_name) && isset($data->email) && isset($data->subject) && isset($data->message)) {
            $sender_name = $conn->real_escape_string($data->sender_name);
            $email = $conn->real_escape_string($data->email);
            $subject = $conn->real_escape_string($data->subject);
            $message = $conn->real_escape_string($data->message);

            $sql = "INSERT INTO messages (sender_name, email, subject, message) VALUES ('$sender_name', '$email', '$subject', '$message')";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(array("success" => true, "message" => "Pesan berhasil dikirim"));
            } else {
                echo json_encode(array("success" => false, "message" => "Error: " . $conn->error));
            }
        } else {
            echo json_encode(array("success" => false, "message" => "Data tidak lengkap"));
        }
        break;
        
    case 'DELETE':
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        if($id > 0) {
            $sql = "DELETE FROM messages WHERE id=$id";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(array("success" => true, "message" => "Pesan berhasil dihapus"));
            } else {
                echo json_encode(array("success" => false, "message" => "Error: " . $conn->error));
            }
        } else {
            echo json_encode(array("success" => false, "message" => "ID tidak ditemukan"));
        }
        break;

    default:
        echo json_encode(array("success" => false, "message" => "Method not allowed"));
        break;
}
$conn->close();
?>
