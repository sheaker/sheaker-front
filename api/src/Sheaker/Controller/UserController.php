<?php

namespace Sheaker\Controller;

use Sheaker\Entity\User;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class UserController
{
    public function login(Request $request, Application $app)
    {
        $loginParams['id']         = $app->escape($request->get('id'));
        $loginParams['password']   = $app->escape($request->get('password'));

        foreach($loginParams as $value) {
            if (!isset($value)) {
                $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
            }
        }

        $loginParams['rememberMe'] = $app->escape($request->get('rememberMe'));

        $user = $app['repository.user']->find($loginParams['id']);
        if (!$user) {
            $app->abort(Response::HTTP_NOT_FOUND, 'User not found');
        }

        if (password_verify($loginParams['password'], $user->getPassword())) {
            $user->setLastSeen(date('Y-m-d H:i:s', time()));
            $user->setLastIP("0.0.0.0"/*$request->headers->get('referer')*/);
            $user->setFailedLogins(0);
            $app['repository.user']->save($user);

            $exp = ($loginParams['rememberMe']) ? time() + 60 * 60 * 24 * 360 : time() + 60 * 60 * 24; // expire in 1year or 24h
            $userToken = [
                'id'          => $user->getId(),
                'name'        => $user->getFirstName(),
                'lastname'    => $user->getLastname(),
                'permissions' => [
                    $app['api.accessLevels'][$user->getUserLevel()]
                ],
                'rememberMe'  => $loginParams['rememberMe']
            ];

            $token = $app['jwt']->createToken($request->headers->get('referer'), $exp, $userToken);
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
        $oldToken = $app['jwt']->checkIfTokenIsPresentAndLikeAVirgin($request);

        $exp = ($oldToken['rememberMe']) ? time() + 60 * 60 * 24 * 360 : time() + 60 * 60 * 24; // expire in 1year or 24h
        $newToken = $app['jwt']->createToken($request->headers->get('referer'), $exp, $oldToken['user']);

        return json_encode(['token' => $newToken], JSON_NUMERIC_CHECK);
    }

    public function listUsers(Request $request, Application $app)
    {
        $token = $app['jwt']->checkIfTokenIsPresentAndLikeAVirgin($request);

        if (!in_array('admin', $token->user->permissions) && !in_array('modo', $token->user->permissions)) {
            $app->abort(Response::HTTP_FORBIDDEN, 'Forbidden');
        }

        $limit = 50;
        $offset = 0;
        $users = $app['repository.user']->findAll($limit, $offset, array('id' => 'DESC'));

        return json_encode(array_values($users), JSON_NUMERIC_CHECK);
    }

    public function getUser(Request $request, Application $app)
    {
        $token = $app['jwt']->checkIfTokenIsPresentAndLikeAVirgin($request);

        if (!in_array('admin', $token->user->permissions) && !in_array('modo', $token->user->permissions)) {
            $app->abort(Response::HTTP_FORBIDDEN, 'Forbidden');
        }

        $getParams = [];
        $getParams['id'] = $app->escape($request->get('id'));

        foreach($getParams as $value) {
            if (!isset($value)) {
                $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
            }
        }

        $user = $app['repository.user']->find($getParams['id']);
        if (!$user) {
            $app->abort(Response::HTTP_NOT_FOUND, 'User not found');
        }

        return json_encode($user, JSON_NUMERIC_CHECK);
    }

    public function update(Request $request, Application $app)
    {
        $token = $app['jwt']->checkIfTokenIsPresentAndLikeAVirgin($request);

        if (!in_array('admin', $token->user->permissions) && !in_array('modo', $token->user->permissions)) {
            $app->abort(Response::HTTP_FORBIDDEN, 'Forbidden');
        }

        $updateParams = [];
        $updateParams['id']        = $app->escape($request->get('id'));
        $updateParams['firstName'] = $app->escape($request->get('firstName'));
        $updateParams['lastName']  = $app->escape($request->get('lastName'));
        $updateParams['mail']      = $app->escape($request->get('mail'));
        $updateParams['gender']    = $app->escape($request->get('gender'));
        $updateParams['birthdate'] = $app->escape($request->get('birthdate'));

        foreach($updateParams as $value) {
            if (!isset($value)) {
                $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
            }
        }

        $updateParams['photo']     = $app->escape($request->get('photo'));
        $updateParams['sponsor']   = $app->escape($request->get('sponsor'));
        $updateParams['comment']   = $app->escape($request->get('comment'));

        $user = $app['repository.user']->find($updateParams['id']);
        if (!$user) {
            $app->abort(Response::HTTP_NOT_FOUND, 'User not found');
        }

        $user->setFirstName($updateParams['firstName']);
        $user->setLastName($updateParams['lastName']);
        $user->setMail($updateParams['mail']);
        $user->setGender($updateParams['gender']);
        $user->setBirthdate($updateParams['birthdate']);
        $user->setPhoto($updateParams['photo']);
        $user->setSponsor($updateParams['sponsor']);
        $user->setComment($updateParams['comment']);
        $app['repository.user']->save($user);

        return json_encode($user, JSON_NUMERIC_CHECK);
    }

    public function create(Request $request, Application $app)
    {
        $token = $app['jwt']->checkIfTokenIsPresentAndLikeAVirgin($request);

        if (!in_array('admin', $token->user->permissions) && !in_array('modo', $token->user->permissions)) {
            $app->abort(Response::HTTP_FORBIDDEN, 'Forbidden');
        }

        $newParams = [];
        $newParams['firstName'] = $app->escape($request->get('firstName'));
        $newParams['lastName']  = $app->escape($request->get('lastName'));
        $newParams['mail']      = $app->escape($request->get('mail'));
        $newParams['gender']    = $app->escape($request->get('gender'));
        $newParams['birthdate'] = $app->escape($request->get('birthdate'));

        foreach($newParams as $value) {
            if (!isset($value)) {
                $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
            }
        }

        $newParams['photo']     = $app->escape($request->get('photo'));
        $newParams['sponsor']   = $app->escape($request->get('sponsor'));
        $newParams['comment']   = $app->escape($request->get('comment'));

        $generatedPassword = substr(str_shuffle("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+;:,.?"), 0, 6);

        $user = new User();
        $user->setFirstName($newParams['firstName']);
        $user->setLastName($newParams['lastName']);
        $user->setPassword(password_hash($generatedPassword, PASSWORD_DEFAULT));
        $user->setMail($newParams['mail']);
        $user->setBirthdate(date('Y-m-d H:i:s', strtotime($newParams['birthdate'])));
        $user->setGender($newParams['gender']);
        $user->setLastSeen('0000-00-00 00:00:00');
        $user->setLastIP('0.0.0.0');
        $user->setFailedLogins(0);
        $user->setPhoto($newParams['photo']);
        $user->setSponsor($newParams['sponsor']);
        $user->setComment($newParams['comment']);
        $app['repository.user']->save($user);

        return json_encode($user, JSON_NUMERIC_CHECK);
    }
}
