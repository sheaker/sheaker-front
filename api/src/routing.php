<?php

/*
 * Main routes
 */
$app->post('/login',       'Sheaker\Controller\MainController::login');
$app->post('/renew_token', 'Sheaker\Controller\MainController::renewToken');

/*
 * Users routes
 */
$app->get('/users',      'Sheaker\Controller\UserController::getUsersList');
$app->get('/users/{id}', 'Sheaker\Controller\UserController::getUser');
$app->post('/users',     'Sheaker\Controller\UserController::addUser');
$app->put('/users/{id}', 'Sheaker\Controller\UserController::editUser');

/*
 * User Payments routes
 */
$app->get('/payments',      'Sheaker\Controller\UserPaymentController::getUserPaymentsList');
//$app->get('/payments/{id}', 'Sheaker\Controller\UserPaymentController::getUserPayment');
$app->post('/payments',     'Sheaker\Controller\UserPaymentController::addUserPayment');
