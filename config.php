<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

/* DB Config */
$config = [
    'database_host'=>'23.106.61.67',
    'database_user'=>'advretoapi_usr',
    'database_password'=>'o~6?!5drsp)+',
];

if (defined('CONNECTION') && constant('CONNECTION')) {
    require_once(__DIR__ . '/dblib/Mysql.php');
    require_once(__DIR__ . '/dblib/Mysql/Exception.php');
    require_once(__DIR__ . '/dblib/Mysql/Statement.php');

    // Подключение к СУБД, выбор кодировки и базы данных.
    $db = Database_Mysql::create($config['database_host'], $config['database_user'], $config['database_password'])
        ->setCharset('utf8')
        ->setDatabaseName('advretoapi_db1');
    $db->query("SET NAMES utf8mb4");
}



