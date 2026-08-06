<?php
require 'db_config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT id, nip, name, position, subject, phone, photo_url FROM teachers ORDER BY id DESC";
        $result = $conn->query($sql);
        $teachers = array();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $teachers[] = $row;
            }
        }
        echo json_encode($teachers);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if (isset($data->action) && $data->action === 'delete') {
            if(isset($data->id)) {
                $id = (int)$data->id;
                $sql = "DELETE FROM teachers WHERE id=$id";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("success" => true, "message" => "Data guru berhasil dihapus"));
                } else {
                    echo json_encode(array("success" => false, "message" => "Error: " . $conn->error));
                }
            } else {
                echo json_encode(array("success" => false, "message" => "ID tidak ditemukan"));
            }
            break;
        }

        if(isset($data->name) && isset($data->position) && isset($data->subject)) {
            $nip = isset($data->nip) ? $conn->real_escape_string($data->nip) : '';
            $name = $conn->real_escape_string($data->name);
            $position = $conn->real_escape_string($data->position);
            $subject = $conn->real_escape_string($data->subject);
            $phone = isset($data->phone) ? $conn->real_escape_string($data->phone) : '';
            $photo_url = isset($data->photo_url) ? $conn->real_escape_string($data->photo_url) : '';

            if (isset($data->id)) {
                // Update
                $id = (int)$data->id;
                $sql = "UPDATE teachers SET nip='$nip', name='$name', position='$position', subject='$subject', phone='$phone', photo_url='$photo_url' WHERE id=$id";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("success" => true, "message" => "Data guru berhasil diperbarui", "data" => $data));
                } else {
                    echo json_encode(array("success" => false, "message" => "Error: " . $conn->error));
                }
            } else {
                // Create
                $sql = "INSERT INTO teachers (nip, name, position, subject, phone, photo_url) VALUES ('$nip', '$name', '$position', '$subject', '$phone', '$photo_url')";
                if ($conn->query($sql) === TRUE) {
                    $data->id = $conn->insert_id;
                    echo json_encode(array("success" => true, "message" => "Guru berhasil ditambahkan", "data" => $data));
                } else {
                    echo json_encode(array("success" => false, "message" => "Error: " . $conn->error));
                }
            }
        } else {
            echo json_encode(array("success" => false, "message" => "Data tidak lengkap"));
        }
        break;
        
    case 'DELETE':
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        if($id > 0) {
            $sql = "DELETE FROM teachers WHERE id=$id";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(array("success" => true, "message" => "Data guru berhasil dihapus"));
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
