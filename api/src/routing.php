<?php

/*
 * User routes
 */
$app->post('/users/login',       'Sheaker\Controller\UserController::login');
$app->post('/users/renew_token', 'Sheaker\Controller\UserController::renewToken');
$app->get('/users',              'Sheaker\Controller\UserController::getUsers');
$app->put('/users',              'Sheaker\Controller\UserController::updateUser');
$app->post('/users',             'Sheaker\Controller\UserController::createUser');

/*
 * Charge routes
 */
$app->post('/users/{id}/charge', 'Sheaker\Controller\UserPaymentController::charge');
$app->get('/users/{id}/charge',  'Sheaker\Controller\UserPaymentController::historyPayments');
