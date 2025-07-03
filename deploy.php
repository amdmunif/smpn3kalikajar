<?php
// Deployment configuration
$deployment = [
    'version' => '1.0.0',
    'required_php_version' => '7.4',
    'required_extensions' => [
        'pdo',
        'pdo_mysql',
        'mbstring',
        'json',
        'gd',
        'fileinfo'
    ],
    'database' => [
        'name' => 'smpn3kalikajar',
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_general_ci'
    ],
    'directories' => [
        'uploads' => [
            'galeri',
            'berita',
            'ppdb'
        ],
        'cache' => [
            'tmp'
        ]
    ],
    'files_to_ignore' => [
        '.git',
        '.gitignore',
        '.env',
        'deploy.php',
        'setup_database.php',
        'setup_web_server.sh'
    ],
    'permissions' => [
        'uploads' => '755',
        'cache' => '755',
        'config.php' => '644',
        'db.php' => '644'
    ]
];

// Check PHP version
if (version_compare(PHP_VERSION, $deployment['required_php_version'], '<')) {
    die("Error: PHP version must be at least " . $deployment['required_php_version'] . ". Current version: " . PHP_VERSION);
}

// Check required extensions
foreach ($deployment['required_extensions'] as $extension) {
    if (!extension_loaded($extension)) {
        die("Error: Required PHP extension '$extension' is not installed");
    }
}

// Display deployment information
echo "Deployment Configuration:\n";
echo "PHP Version: " . PHP_VERSION . "\n";
echo "Required Extensions: " . implode(', ', $deployment['required_extensions']) . "\n";

echo "\nDeployment Instructions:\n";
echo "1. Upload all files to your hosting server\n";
echo "2. Create database with name: " . $deployment['database']['name'] . "\n";
echo "3. Import database schema from database/schema.sql\n";
echo "4. Update database credentials in includes/config.php\n";
echo "5. Set correct permissions for directories:\n";
foreach ($deployment['permissions'] as $dir => $perm) {
    echo "   - $dir: $perm\n";
}

echo "\nSecurity Notes:\n";
echo "1. Change default admin password immediately\n";
echo "2. Keep includes/config.php and includes/db.php secure\n";
echo "3. Regularly update PHP and extensions\n";
echo "4. Monitor server logs for security issues\n";
?>
