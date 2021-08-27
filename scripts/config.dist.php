<?php
// Register handler
set_error_handler("error_handler");
set_exception_handler("error_handler");
//register_shutdown_function("error_handler");

function error_handler()
{
    // Check for unhandled errors (fatal shutdown)
    $e = error_get_last();

    // If none, check function args (error handler)
    if ($e === null) {
        $e = func_get_args();

        if (!empty($e)) {
            // "Normalize" exceptions (exception handler)
            if($e[0] instanceof Exception || $e[0] instanceof Error)
            {
                call_user_func_array(__FUNCTION__, array(
                    $e[0]->getCode(),
                    $e[0]->getMessage(),
                    $e[0]->getFile(),
                    $e[0]->getLine(),
                    $e[0]));
                return;
            }
        }
    }

    // Return if no error
    if(empty($e))
        return;

    // Create with consistent array keys
    $e = array_combine(array('number', 'message', 'file', 'line', 'context'),
        array_pad($e, 5, null));

    // Output error page
    log_error($e);
}

// require_once(__DIR__ . '/vendor/autoload.php');

use Monolog\Logger;
use Monolog\Handler\RotatingFileHandler;

const LOG_PATH = '/opt/php-logs/adverto.sale/';

// $stream = new RotatingFileHandler(LOG_PATH . 'error.log', 10, Logger::ERROR);

// create a log channel
// $logger = new Logger('adverto.site');
// $logger->pushHandler($stream);

function log_error($error) {
    global $logger;

print_r($error);
    // add records to the log
//     $logger->error(json_encode($error));
}

/* DB Config */
$config = array(
    'database_host'=>'localhost',
    'database_user'=>'adv_user',
    'database_password'=>'aKjh76aa915BN'
);

/* Program main values */
$protocol = 'http://'; // Протокол, по которому работает сайт. Можно оставить http, потому что в app.php будет проверка и если нужен https, программа это поймет
$crpt = 'd0a7e7977b6d5fcd55f4b5c89517b33cd923e88837b63bf4469ef819dc8ca834'; // Не менять
$api_url = 'https://api.adverto.sale/v1/';
//$api_url = 'http://api.straus.su/api/v1/';
$test_files_path = '/opt/www/adverto.sale/';
$site_domain = 'adverto.sale';

$chat_socket_lib_url = 'https://chat.adverto.sale/socket.io/socket.io.js';
$chat_socket_url = 'wss://chat.adverto.sale';
$chat_secur_postfix = "aaa";

const SPARKPOST_SEND_API_KEY = 'd9e84cce3aa6934534806c1ddbecd136e1193f9a';

const GEOIP_DATABASE_PATH = '/usr/share/GeoIP/GeoLite2-City.mmdb';

/* DB Connect and Headers inits, includs */
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');

require_once(__DIR__ . '/lib.php');
require_once(__DIR__ . '/web-api/crypt.class.php');

// Подключаем массивы языков, флагов и категорий и фраз
if(file_exists(__DIR__ . '/inc/default_arrays.php')) {
	require_once(__DIR__ . '/inc/default_arrays.php');
}

if (defined('CONNECTION') && constant('CONNECTION')) {
    require_once(__DIR__ . '/dblib/Mysql.php');
    require_once(__DIR__ . '/dblib/Mysql/Exception.php');
    require_once(__DIR__ . '/dblib/Mysql/Statement.php');

    // Подключение к СУБД, выбор кодировки и базы данных.
    $db = Database_Mysql::create($config['database_host'], $config['database_user'], $config['database_password'])
        ->setCharset('utf8')
        ->setDatabaseName('adv');

    $db->query("SET NAMES utf8mb4");
}

$yandex_verification = [];

// Google keys for site
$googleSiteKeys = array(
    'AIzaSyAMWVvKQTiMe06BVXudaoxf2qT3coBvx-0'
);

// Google keys for server
$googleServerKeys = array(
    'AIzaSyB78ByaavN5HrSpp1ubCWyFuvc9P0v5e4c'
);

// Настройки для реферральской программы
// Устанавливаем количество активных юзеров, которые должны быть для присвоения следующего статуса
$account_group_names = array('USER', 'SILVER', 'GOLD', 'PLATINUM', 'BOSS');
$referral_users_counts = array(0, 100, 200, 350, 1000);
// Сумма, которая выплачивается за каждого активного пользователя для тех, кто привлекает с разным типом аккаунта
$referral_ammounts['RUB'] = array(45, 70, 90, 100, 100);
$referral_ammounts['EUR'] = array(0.4, 0.7, 0.9, 1, 1);
$referral_ammounts['USD'] = array(0.4, 0.7, 0.9, 1, 1);

$referral_min_withdraw['RUB'] = 5000;
$referral_min_withdraw['EUR'] = 50;
$referral_min_withdraw['USD'] = 50;

header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
?>