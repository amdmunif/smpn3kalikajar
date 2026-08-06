<?php
require_once 'db_config.php';

try {
    $host = "127.0.0.1"; // Force IPv4 for CLI
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Running migrations...\n";

    // Create external_services table
    $sql1 = "CREATE TABLE IF NOT EXISTS external_services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        icon_url VARCHAR(255)
    )";
    $pdo->exec($sql1);
    echo "external_services table created or exists.\n";

    // Alter teachers table to add position
    try {
        $sql2 = "ALTER TABLE teachers ADD COLUMN position VARCHAR(255) AFTER nip";
        $pdo->exec($sql2);
        echo "Added 'position' column to teachers.\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            echo "Column 'position' already exists in teachers.\n";
        } else {
            throw $e;
        }
    }

    echo "Migration complete.\n";

} catch (PDOException $e) {
    die("Error: " . $e->getMessage() . "\n");
}
?>
