<?php

/*
 * User routes
 */
$app->post('/users/login',       'Sheaker\Controller\UserController::loginAction');
$app->post('/users/renew_token', 'Sheaker\Controller\UserController::renewTokenAction');
