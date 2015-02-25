<?php

/*
 * User routes
 */
$app->post('/users/login',       'Sheaker\Controller\UserController::login');
$app->post('/users/renew_token', 'Sheaker\Controller\UserController::renewToken');
$app->get('/users',              'Sheaker\Controller\UserController::list');
$app->post('/users',             'Sheaker\Controller\UserController::create');
