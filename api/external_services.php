<?php
require_once 'db_config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM external_services ORDER BY id DESC";
        $result = $conn->query($sql);
        $services = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $services[] = $row;
            }
        }
        echo json_encode($services);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            echo json_encode(['success' => false, 'message' => 'Invalid input']);
            exit;
        }

        $id = isset($input['id']) ? intval($input['id']) : 0;
        $name = $conn->real_escape_string($input['name']);
        $url = $conn->real_escape_string($input['url']);
        $icon_url = $conn->real_escape_string($input['icon_url'] ?? '');

        if ($id > 0) {
            // Update
            $sql = "UPDATE external_services SET name='$name', url='$url', icon_url='$icon_url' WHERE id=$id";
        } else {
            // Insert
            $sql = "INSERT INTO external_services (name, url, icon_url) VALUES ('$name', '$url', '$icon_url')";
        }

        if ($conn->query($sql) === TRUE) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if ($id > 0) {
            $sql = "DELETE FROM external_services WHERE id=$id";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid ID']);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

$conn->close();
?>
