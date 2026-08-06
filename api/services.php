<?php
require 'db_config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM services ORDER BY id DESC";
        $result = $conn->query($sql);
        $services = array();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $services[] = $row;
            }
        }
        echo json_encode($services);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if (isset($data->action) && $data->action === 'delete') {
            if(isset($data->id)) {
                $id = (int)$data->id;
                $sql = "DELETE FROM services WHERE id=$id";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("success" => true, "message" => "Layanan berhasil dihapus"));
                } else {
                    echo json_encode(array("success" => false, "message" => "Error: " . $conn->error));
                }
            } else {
                echo json_encode(array("success" => false, "message" => "ID tidak ditemukan"));
            }
            break;
        }

        if(isset($data->name) && isset($data->description)) {
            $name = $conn->real_escape_string($data->name);
            $description = $conn->real_escape_string($data->description);
            $icon_url = isset($data->icon_url) ? $conn->real_escape_string($data->icon_url) : '';

            if (isset($data->id)) {
                // Update
                $id = (int)$data->id;
                $sql = "UPDATE services SET name='$name', description='$description', icon_url='$icon_url' WHERE id=$id";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("success" => true, "message" => "Layanan berhasil diperbarui", "data" => $data));
                } else {
                    echo json_encode(array("success" => false, "message" => "Error: " . $conn->error));
                }
            } else {
                // Create
                $sql = "INSERT INTO services (name, description, icon_url) VALUES ('$name', '$description', '$icon_url')";
                if ($conn->query($sql) === TRUE) {
                    $data->id = $conn->insert_id;
                    echo json_encode(array("success" => true, "message" => "Layanan berhasil ditambahkan", "data" => $data));
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
            $sql = "DELETE FROM services WHERE id=$id";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(array("success" => true, "message" => "Layanan berhasil dihapus"));
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
