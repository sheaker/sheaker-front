<?php

namespace Sheaker\Controller;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class MainController
{
    public function getSheakerClient(Request $request, Application $app)
    {
        $getParams = [];
        $getParams['subdomain'] = $app->escape($request->get('subdomain'));

        foreach ($getParams as $value) {
            if (!isset($value)) {
                $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
            }
        }

        $clientSub = $getParams['subdomain'];
        $ch = curl_init($app['sheaker.api'] . "/clients?subdomain={$clientSub}");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $client = curl_exec($ch);
        curl_close($ch);

        return $client;
    }

    public function getSheakerInfos(Request $request, Application $app)
    {
        $ch = curl_init($app['sheaker.api'] . "/infos");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $infos = curl_exec($ch);
        curl_close($ch);

        return $infos;
    }

    public function login(Request $request, Application $app)
    {
        $loginParams = [];
        $loginParams['id']       = $app->escape($request->get('id'));
        $loginParams['password'] = $app->escape($request->get('password'));

        foreach ($loginParams as $value) {
            if (!isset($value)) {
                $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
            }
        }

        $loginParams['rememberMe'] = $app->escape($request->get('rememberMe'));

        $user = $app['repository.user']->findByCustomId($loginParams['id']);
        if (!$user) {
            $user = $app['repository.user']->findById($loginParams['id']);
            if (!$user) {
                $app->abort(Response::HTTP_NOT_FOUND, 'User not found');
            }
        }

        if (password_verify($loginParams['password'], $user->getPassword())) {
            $user->setLastSeen(date('Y-m-d H:i:s', time()));
            $user->setLastIP($request->headers->get('referer'));
            $user->setFailedLogins(0);
            $app['repository.user']->save($user);

            $exp = ($loginParams['rememberMe']) ? time() + 60 * 60 * 24 * 360 : time() + 60 * 60 * 24; // expire in 1year or 24h
            $userToken = [
                'number'      => ($user->getCustomId()) ? $user->getCustomId() : $user->getId(),
                'name'        => $user->getFirstName(),
                'lastname'    => $user->getLastname(),
                'permissions' => [
                    $app['api.accessLevels'][$user->getUserLevel()]
                ],
                'rememberMe'  => $loginParams['rememberMe']
            ];

            $token = $app['jwt']->createToken($request, $exp, $userToken);
        }
        else {
            $user->setFailedLogins($user->getFailedLogins() + 1);
            $app['repository.user']->save($user);
            $app->abort(Response::HTTP_FORBIDDEN, 'Wrong password');
        }

        return json_encode(['token' => $token], JSON_NUMERIC_CHECK);
    }

    public function renewToken(Request $request, Application $app)
    {
        $renewParams = [];
        $renewParams['idClient'] = $app->escape($request->get('client'));
        $renewParams['oldToken'] = $app->escape($request->get('oldToken'));

        foreach ($renewParams as $value) {
            if (!isset($value)) {
                $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
            }
        }

        // Retrieve the secret key on Sheaker API to encode the token
        $idClient = $renewParams['idClient'];
        $ch = curl_init($app['sheaker.api'] . "/clients?id={$idClient}");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $client = json_decode(curl_exec($ch));
        curl_close($ch);

        $oldToken = \JWT::decode($renewParams['oldToken'], $client->secretKey, false);

        $exp = ($oldToken->user->rememberMe) ? time() + 60 * 60 * 24 * 360 : time() + 60 * 60 * 24; // expire in 1year or 24h
        $newToken = $app['jwt']->createToken($request, $exp, $oldToken->user);

        return json_encode(['token' => $newToken], JSON_NUMERIC_CHECK);
    }
}
