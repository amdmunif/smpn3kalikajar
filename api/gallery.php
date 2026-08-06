<?php
require 'db_config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM gallery ORDER BY id DESC";
        $result = $conn->query($sql);
        $gallery = array();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $gallery[] = $row;
            }
        }
        echo json_encode($gallery);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if (isset($data->action) && $data->action === 'delete') {
            if(isset($data->id)) {
                $id = (int)$data->id;
                $sql = "DELETE FROM gallery WHERE id=$id";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("success" => true, "message" => "Gambar berhasil dihapus"));
                } else {
                    echo json_encode(array("success" => false, "message" => "Error: " . $conn->error));
                }
            } else {
                echo json_encode(array("success" => false, "message" => "ID tidak ditemukan"));
            }
            break;
        }

        if(isset($data->image_url) && isset($data->caption)) {
            $image_url = $conn->real_escape_string($data->image_url);
            $caption = $conn->real_escape_string($data->caption);

            $sql = "INSERT INTO gallery (image_url, caption) VALUES ('$image_url', '$caption')";
            if ($conn->query($sql) === TRUE) {
                $data->id = $conn->insert_id;
                echo json_encode(array("success" => true, "message" => "Gambar berhasil ditambahkan", "data" => $data));
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
            $sql = "DELETE FROM gallery WHERE id=$id";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(array("success" => true, "message" => "Gambar berhasil dihapus"));
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
