<?php
require 'db_config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM facilities ORDER BY id ASC";
        $result = $conn->query($sql);
        $facilities = array();
        if ($result && $result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $facilities[] = $row;
            }
        }
        echo json_encode($facilities);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if (isset($data->action) && $data->action === 'delete') {
            if(isset($data->id)) {
                $id = (int)$data->id;
                $sql = "DELETE FROM facilities WHERE id=$id";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("success" => true, "message" => "Fasilitas berhasil dihapus"));
                } else {
                    echo json_encode(array("success" => false, "message" => "Error DB: " . $conn->error));
                }
            } else {
                echo json_encode(array("success" => false, "message" => "ID tidak ditemukan"));
            }
            break;
        }

        if(isset($data->name)) {
            $name = $conn->real_escape_string($data->name);
            $description = isset($data->description) ? $conn->real_escape_string($data->description) : '';
            $image_url = isset($data->image_url) ? $conn->real_escape_string($data->image_url) : '';

            if (isset($data->id) && (int)$data->id > 0) {
                // Update
                try {
                    $id = (int)$data->id;
                    $sql = "UPDATE facilities SET name='$name', description='$description', image_url='$image_url' WHERE id=$id";
                    if ($conn->query($sql) === TRUE) {
                        echo json_encode(array("success" => true, "message" => "Fasilitas berhasil diperbarui"));
                    } else {
                        echo json_encode(array("success" => false, "message" => "Error DB: " . $conn->error));
                    }
                } catch (Throwable $e) {
                    echo json_encode(array("success" => false, "message" => "Error DB: " . $e->getMessage()));
                }
            } else {
                // Create
                try {
                    $sql = "INSERT INTO facilities (name, description, image_url) VALUES ('$name', '$description', '$image_url')";
                    if ($conn->query($sql) === TRUE) {
                        $data->id = $conn->insert_id;
                        echo json_encode(array("success" => true, "message" => "Fasilitas berhasil ditambahkan", "data" => $data));
                    } else {
                        echo json_encode(array("success" => false, "message" => "Error DB: " . $conn->error));
                    }
                } catch (Throwable $e) {
                    echo json_encode(array("success" => false, "message" => "Error DB: " . $e->getMessage()));
                }
            }
        } else {
            echo json_encode(array("success" => false, "message" => "Data tidak lengkap"));
        }
        break;
        
    case 'DELETE':
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        if($id > 0) {
            $sql = "DELETE FROM facilities WHERE id=$id";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(array("success" => true, "message" => "Fasilitas berhasil dihapus"));
            } else {
                echo json_encode(array("success" => false, "message" => "Error DB: " . $conn->error));
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
