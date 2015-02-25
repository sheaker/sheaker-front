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
            $user->setLastSeen(new \DateTime('now'));
            $user->setLastIP($request->headers->get('referer'));
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

    public function list(Request $request, Application $app)
    {
        $token = $app['jwt']->checkIfTokenIsPresentAndLikeAVirgin($request);

        if (!in_array('admin', $token->user->permissions) && !in_array('modo', $token->user->permissions))
            $app->abort(Response::HTTP_FORBIDDEN, 'Forbidden');

        $users = $app['repository.user']->findAll(50);

        return json_encode(array_values($users), JSON_NUMERIC_CHECK);
    }

    public function create(Request $request, Application $app)
    {
        $token = $app['jwt']->checkIfTokenIsPresentAndLikeAVirgin($request);

        if (!in_array('admin', $token->user->permissions) && !in_array('modo', $token->user->permissions))
            $app->abort(Response::HTTP_FORBIDDEN, 'Forbidden');

        $newUser = [];
        $newUser['firstName'] = $app->escape($request->get('firstName'));
        $newUser['lastName']  = $app->escape($request->get('lastName'));
        $newUser['mail']      = $app->escape($request->get('mail'));
        $newUser['gender']    = $app->escape($request->get('gender'));
        $newUser['birthdate'] = $app->escape($request->get('birthdate'));
        $newUser['photo']     = $app->escape($request->get('userPhoto'));

        foreach($newUser as $value) {
            if (!isset($value)) {
                $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
            }
        }

        $newUser['sponsor']   = $app->escape($request->get('sponsor'));
        $newUser['comment']   = $app->escape($request->get('comment'));

        $generatedPassword = substr(str_shuffle("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+;:,.?"), 0, 6);

        $user = new User();
        $user->setFirstName($newUser['firstName']);
        $user->setLastName($newUser['lastName']);
        $user->setPassword(password_hash($generatedPassword, PASSWORD_DEFAULT));
        $user->setMail($newUser['mail']);
        $user->setBirthdate(new \DateTime(date("Y-m-d H:i:s", strtotime($newUser['birthdate']))));
        $user->setGender($newUser['gender']);
        $user->setLastSeen(new \DateTime('0000-00-00'));
        $user->setLastIP('0.0.0.0');
        $user->setFailedLogins(0);
        $user->setPhoto($newUser['photo']);
        $user->setSponsor($newUser['sponsor']);
        $user->setComment($newUser['comment']);
        $app['repository.user']->save($user);

        return json_encode($user, JSON_NUMERIC_CHECK);
    }
}
