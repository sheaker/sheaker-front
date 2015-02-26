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
            $user->setLastSeen(date("Y-m-d H:i:s", time()));
            $user->setLastIP("0.0.0.0"/*$request->headers->get('referer')*/);
            $user->setFailedLogins(0);
            $app['repository.user']->save($user);

            $exp = ($rememberMe) ? time() + 60 * 60 * 24 * 360 : time() + 60 * 60 * 24; // expire in 1year or 24h
            $userToken = [
                'id'          => $user->getId(),
                'name'        => $user->getFirstName(),
                'lastname'    => $user->getLastname(),
                'permissions' => [
                    $app['api.accessLevels'][$user->getUserLevel()]
                ],
                'rememberMe'  => $rememberMe
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

        $userId = $app->escape($request->get('id'));

        $user = $app['repository.user']->find($userId);
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

        $updateUser = [];
        $updateUser['id']        = $app->escape($request->get('id'));
        $updateUser['firstName'] = $app->escape($request->get('firstName'));
        $updateUser['lastName']  = $app->escape($request->get('lastName'));
        $updateUser['mail']      = $app->escape($request->get('mail'));
        $updateUser['gender']    = $app->escape($request->get('gender'));
        $updateUser['birthdate'] = $app->escape($request->get('birthdate'));

        foreach($updateUser as $value) {
            if (!isset($value)) {
                $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
            }
        }

        $updateUser['photo']     = $app->escape($request->get('photo'));
        $updateUser['sponsor']   = $app->escape($request->get('sponsor'));
        $updateUser['comment']   = $app->escape($request->get('comment'));

        $user = $app['repository.user']->find($updateUser['id']);
        if (!$user) {
            $app->abort(Response::HTTP_NOT_FOUND, 'User not found');
        }

        $user->setFirstName($updateUser['firstName']);
        $user->setLastName($updateUser['lastName']);
        $user->setMail($updateUser['mail']);
        $user->setGender($updateUser['gender']);
        $user->setBirthdate($updateUser['birthdate']);
        $user->setPhoto($updateUser['photo']);
        $user->setSponsor($updateUser['sponsor']);
        $user->setComment($updateUser['comment']);
        $app['repository.user']->save($user);

        return json_encode($user, JSON_NUMERIC_CHECK);
    }

    public function create(Request $request, Application $app)
    {
        $token = $app['jwt']->checkIfTokenIsPresentAndLikeAVirgin($request);

        if (!in_array('admin', $token->user->permissions) && !in_array('modo', $token->user->permissions)) {
            $app->abort(Response::HTTP_FORBIDDEN, 'Forbidden');
        }

        $newUser = [];
        $newUser['firstName'] = $app->escape($request->get('firstName'));
        $newUser['lastName']  = $app->escape($request->get('lastName'));
        $newUser['mail']      = $app->escape($request->get('mail'));
        $newUser['gender']    = $app->escape($request->get('gender'));
        $newUser['birthdate'] = $app->escape($request->get('birthdate'));

        foreach($newUser as $value) {
            if (!isset($value)) {
                $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
            }
        }

        $newUser['photo']     = $app->escape($request->get('photo'));
        $newUser['sponsor']   = $app->escape($request->get('sponsor'));
        $newUser['comment']   = $app->escape($request->get('comment'));

        $generatedPassword = substr(str_shuffle("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+;:,.?"), 0, 6);

        $user = new User();
        $user->setFirstName($newUser['firstName']);
        $user->setLastName($newUser['lastName']);
        $user->setPassword(password_hash($generatedPassword, PASSWORD_DEFAULT));
        $user->setMail($newUser['mail']);
        $user->setBirthdate($newUser['birthdate']);
        $user->setGender($newUser['gender']);
        $user->setLastSeen('0000-00-00 00:00:00');
        $user->setLastIP('0.0.0.0');
        $user->setFailedLogins(0);
        $user->setPhoto($newUser['photo']);
        $user->setSponsor($newUser['sponsor']);
        $user->setComment($newUser['comment']);
        $app['repository.user']->save($user);

        return json_encode($user, JSON_NUMERIC_CHECK);
    }
}
