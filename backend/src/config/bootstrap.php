<?php

require __DIR__ . '/read-env.php';

if (!is_dir(__DIR__ . '/flags')) mkdir(__DIR__ . '/flags', 0777, true);
if (!is_dir(__DIR__ . '/locks')) mkdir(__DIR__ . '/locks', 0777, true);

$init_db_lock = __DIR__ . '/locks/init-db.lock';
$init_db_fromscratch = __DIR__ . '/flags/init-db-fromscratch.done';
$init_db_done = __DIR__ . '/flags/init-db.done';
$lock_handle = fopen($init_db_lock, 'c+');

$db_host = $_ENV['MARIADB_HOST'];
$db_port = $_ENV['MARIADB_PORT'];
$db_name = $_ENV['MARIADB_DATABASE'];
$db_user = $_ENV['MARIADB_USER'];
$db_pass = $_ENV['MARIADB_PASSWORD'];
$db_root_pass = $_ENV['MARIADB_ROOT_PASSWORD'];

$dsn = "mysql:host=$db_host;port=$db_port";

try {
    if (!file_exists($init_db_done) && $lock_handle && flock($lock_handle, LOCK_EX | LOCK_NB)) {
        $pdo = new PDO($dsn, 'root', $db_root_pass, [PDO::MYSQL_ATTR_MULTI_STATEMENTS => true]);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        if (!file_exists($init_db_fromscratch)) {
            $pdo->exec("
                DROP DATABASE IF EXISTS $db_name;
                DROP USER IF EXISTS '$db_user'@'%';

                CREATE DATABASE $db_name;
                CREATE USER '$db_user'@'%' IDENTIFIED BY '$db_pass';
                GRANT ALL PRIVILEGES ON $db_name.* TO '$db_user'@'%';
                FLUSH PRIVILEGES;
            ");
            touch($init_db_fromscratch);
        }

        $pdo = new PDO((string) $dsn . ";dbname=$db_name", $db_user, $db_pass, [PDO::MYSQL_ATTR_MULTI_STATEMENTS => true]);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $db_init_queries = file_get_contents(__DIR__ . '/db-init.sql');
        $pdo->exec($db_init_queries);

        touch($init_db_done);
    }
    
    $pdo = new PDO((string) $dsn . ";dbname=$db_name", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch (PDOException $e) {
    error_log($e->getMessage());
}
finally {
    fclose($lock_handle);
}