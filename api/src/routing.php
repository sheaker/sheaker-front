<?php

/*
 * User routes
 */
$app->post('/users/login',            'Sheaker\Controller\UserController::loginAction');
$app->post('/users/{id}/renew_token', 'Sheaker\Controller\UserController::renewTokenAction')->assert('id', '\d+');
