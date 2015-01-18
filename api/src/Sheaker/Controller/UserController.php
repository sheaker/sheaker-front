<?php

namespace Sheaker\Controller;

use Sheaker\Entity\User;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class UserController
{
    public function loginAction(Request $request, Application $app)
    {
        $id         = $app->escape($request->get('id'));
        $password   = $app->escape($request->get('password'));
        $rememberMe = $app->escape($request->get('rememberMe'));

        if (!$id || !$password) {
            $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
        }

        $user = $app['repository.user']->find($id);
        if (!$user) {
            $app->abort(Response::HTTP_NOT_FOUND, 'User not found');
        }

        if (password_verify($password, $user->getPassword())) {
            $user->setLastSeen(new \DateTime('now'));
            $user->setLastIP($request->headers->get('referer'));
            $user->setFailedLogins(0);
            $app['repository.user']->save($user);

            //$access_query = 'SELECT user_level FROM users_access WHERE user_id = ' . $account['id'];
            //$access       = $app['db']->fetchAssoc($access_query);
            $permissions = [];
            //foreach ($access as $accessLevel) {
            //    array_push($permissions, $app['api.accessLevels'][$accessLevel]);
            //}

            $exp = ($rememberMe) ? time() + 60 * 60 * 24 * 360 : time() + 60 * 60 * 24; // expire in 1year or 24h
            $user = [
                'id'          => $user->getId(),
                'name'        => $user->getName(),
                'lastname'    => $user->getLastname(),
                'permissions' => $permissions,
                'rememberMe'  => $rememberMe
            ];

            $token = $app['jwt']->createToken($request->headers->get('referer'), $exp, $user);
        }
        else {
            $user->setFailedLogins($user->getFailedLogins() + 1);
            $app['repository.user']->save($user);
            $app->abort(Response::HTTP_FORBIDDEN, 'Wrong password');
        }

        return json_encode(['token' => $token], JSON_NUMERIC_CHECK);
    }

    public function renewTokenAction(Request $request, Application $app)
    {
        $oldToken = $app['jwt']->checkIfTokenIsPresentAndLikeAVirgin($request);

        $exp = ($oldToken['rememberMe']) ? time() + 60 * 60 * 24 * 360 : time() + 60 * 60 * 24; // expire in 1year or 24h
        $newToken = $app['jwt']->createToken($request->headers->get('referer'), $exp, $oldToken['user']);

        return json_encode(['token' => $newToken], JSON_NUMERIC_CHECK);
    }
}
