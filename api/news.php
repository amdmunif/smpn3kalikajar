<?php
require 'db_config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM news ORDER BY date DESC, id DESC";
        $result = $conn->query($sql);
        $news = array();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $news[] = $row;
            }
        }
        echo json_encode($news);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if (isset($data->action) && $data->action === 'delete') {
            if(isset($data->id)) {
                $id = (int)$data->id;
                $sql = "DELETE FROM news WHERE id=$id";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("success" => true, "message" => "Berita berhasil dihapus"));
                } else {
                    echo json_encode(array("success" => false, "message" => "Error: " . $conn->error));
                }
            } else {
                echo json_encode(array("success" => false, "message" => "ID tidak ditemukan"));
            }
            break;
        }

        if(isset($data->title) && isset($data->date) && isset($data->excerpt) && isset($data->content)) {
            $title = $conn->real_escape_string($data->title);
            $date = $conn->real_escape_string($data->date);
            $excerpt = $conn->real_escape_string($data->excerpt);
            $content = $conn->real_escape_string($data->content);
            $image_url = isset($data->image_url) ? $conn->real_escape_string($data->image_url) : '';
            $category = isset($data->category) ? $conn->real_escape_string($data->category) : 'Berita';

            if (isset($data->id)) {
                // Update
                $id = (int)$data->id;
                $sql = "UPDATE news SET title='$title', date='$date', excerpt='$excerpt', content='$content', image_url='$image_url', category='$category' WHERE id=$id";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("success" => true, "message" => "Berita berhasil diperbarui", "data" => $data));
                } else {
                    echo json_encode(array("success" => false, "message" => "Error: " . $conn->error));
                }
            } else {
                // Create
                $sql = "INSERT INTO news (title, date, excerpt, content, image_url, category) VALUES ('$title', '$date', '$excerpt', '$content', '$image_url', '$category')";
                if ($conn->query($sql) === TRUE) {
                    $data->id = $conn->insert_id;
                    echo json_encode(array("success" => true, "message" => "Berita berhasil ditambahkan", "data" => $data));
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
            $sql = "DELETE FROM news WHERE id=$id";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(array("success" => true, "message" => "Berita berhasil dihapus"));
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
