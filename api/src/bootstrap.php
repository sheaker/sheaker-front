<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Silex\Application;
use Monolog\Logger;
use Silex\Provider\DoctrineServiceProvider;
use Silex\Provider\MonologServiceProvider;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

define('APPLICATION_ENV', getenv('APPLICATION_ENV') ?: 'production');

$app = new Application();

if (APPLICATION_ENV != 'production') {
    $app['debug'] = true;
    ini_set('display_error', 1);
    error_reporting(E_ALL);
} else {
    $app['controllers']->requireHttps();
}

if ($app['debug']) {
    require_once __DIR__ . '/../config/developement.php';
} else {
    require_once __DIR__ . '/../config/production.php';
}

$app['api.accessLevels'] = [
    0 => 'client',
    1 => 'modo',
    2 => 'admin'
];

/**
 * Register service providers
 */
$app->register(new DoctrineServiceProvider(), [
    'db.options' => [
        'dbname'   => $app['database.dbname'],
        'host'     => $app['database.host'],
        'user'     => $app['database.user'],
        'password' => $app['database.passwd'],
    ],
]);

$app->register(new MonologServiceProvider(), [
    'monolog.logfile' => __DIR__ . '/../logs/application.log',
    'monolog.level'   => Logger::WARNING,
    'monolog.name'    => 'api'
]);

/**
 * Register repositories
 */
$app['repository.user'] = $app->share(function ($app) {
    return new Sheaker\Repository\UserRepository($app['db']);
});

/**
 * Register custom services
 */
$app['jwt'] = $app->share(function ($app) {
    return new Sheaker\Service\JWT($app, $app['api.secretKey']);
});

/**
 * Register before handler
 */
$app->before(function (Request $request) {
    if (strpos($request->headers->get('Content-Type'), 'application/json') === 0) {
        $data = json_decode($request->getContent(), true);
        $request->request->replace(is_array($data) ? $data : array());
    }
});

/**
 * Register error handler
 */
$app->error(function (\Exception $e, $code) use ($app) {
    if ($app['debug'])
        return;

    $app['monolog']->addError($e->getMessage());
    $app['monolog']->addError($e->getTraceAsString());

    return new JsonResponse(['error' => ['code' => $code, 'message' => $e->getMessage()]]);
});

// Black magic to handle OPTIONS with the API
$app->match('{url}', function($url) use ($app) { return 'OK'; })->assert('url', '.*')->method('OPTIONS');

require_once __DIR__ . '/routing.php';

return $app;
