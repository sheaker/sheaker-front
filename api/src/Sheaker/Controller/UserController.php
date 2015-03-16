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
        $ch = curl_init("http://sheaker.com/api/clients?id={$idClient}");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $client = json_decode(curl_exec($ch));
        curl_close($ch);

        $oldToken = \JWT::decode($renewParams['oldToken'], $client->secretKey, false);

        $exp = ($oldToken->user->rememberMe) ? time() + 60 * 60 * 24 * 360 : time() + 60 * 60 * 24; // expire in 1year or 24h
        $newToken = $app['jwt']->createToken($request, $exp, $oldToken->user);

        return json_encode(['token' => $newToken], JSON_NUMERIC_CHECK);
    }

    public function listUsers(Request $request, Application $app)
    {
        $token = $app['jwt']->checkIfTokenIsPresentAndLikeAVirgin($request);

        if (!in_array('admin', $token->user->permissions) && !in_array('modo', $token->user->permissions)) {
            $app->abort(Response::HTTP_FORBIDDEN, 'Forbidden');
        }

        $getParams = [];
        $getParams['limit']  = $app->escape($request->get('limit'));
        $getParams['offset'] = $app->escape($request->get('offset'));
        $getParams['sortBy'] = $app->escape($request->get('sortBy'));
        $getParams['order']  = $app->escape($request->get('order'));

        $limit  = (!empty($getParams['limit'])) ? $getParams['limit'] : 50;
        $offset = (!empty($getParams['offset'])) ? $getParams['offset'] : 0;
        $sortBy = (!empty($getParams['sortBy'])) ? $getParams['sortBy'] : 'created_at';
        $order  = (!empty($getParams['order'])) ? $getParams['order'] : 'DESC';

        $users = $app['repository.user']->findAll($limit, $offset, array($sortBy => $order));

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

        foreach ($getParams as $value) {
            if (!isset($value)) {
                $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
            }
        }

        $user = $app['repository.user']->findByCustomId($getParams['id']);
        if (!$user) {
            $user = $app['repository.user']->findById($getParams['id']);
            if (!$user) {
                $app->abort(Response::HTTP_NOT_FOUND, 'User not found');
            }
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
        $updateParams['id']             = $app->escape($request->get('id'));
        $updateParams['firstName']      = $app->escape($request->get('firstName'));
        $updateParams['lastName']       = $app->escape($request->get('lastName'));
        $updateParams['mail']           = $app->escape($request->get('mail'));
        $updateParams['birthdate']      = $app->escape($request->get('birthdate'));
        $updateParams['addressStreet1'] = $app->escape($request->get('addressStreet1'));
        $updateParams['addressStreet2'] = $app->escape($request->get('addressStreet2'));
        $updateParams['city']           = $app->escape($request->get('city'));
        $updateParams['zip']            = $app->escape($request->get('zip'));
        $updateParams['gender']         = $app->escape($request->get('gender'));

        foreach ($updateParams as $value) {
            if (!isset($value)) {
                $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
            }
        }

        $updateParams['customId']  = $app->escape($request->get('customId', NULL));
        $updateParams['photo']     = $app->escape($request->get('photo'));
        $updateParams['sponsor']   = $app->escape($request->get('sponsor', NULL));
        $updateParams['comment']   = $app->escape($request->get('comment'));

        $user = $app['repository.user']->findById($updateParams['id']);
        if (!$user) {
            $app->abort(Response::HTTP_NOT_FOUND, 'User not found');
        }

        $photoPath = '';
        if (!empty($updateParams['photo'])) {
            if (file_exists($user->getPhoto())) {
                unlink($user->getPhoto());
            }

            $clientPhotosPath = 'photos/' . $app->escape($request->get('client'));
            if (!file_exists($clientPhotosPath)) {
                mkdir($clientPhotosPath);
            }

            $photoPath = $clientPhotosPath . '/' . uniqid() . '.png';
            list($photoType, $updateParams['photo']) = explode(';', $updateParams['photo']);
            list(, $updateParams['photo'])           = explode(',', $updateParams['photo']);
            file_put_contents($photoPath, base64_decode($updateParams['photo']));
        }

        $user->setCustomId($updateParams['customId']);
        $user->setFirstName($updateParams['firstName']);
        $user->setLastName($updateParams['lastName']);
        $user->setMail($updateParams['mail']);
        $user->setBirthdate($updateParams['birthdate']);
        $user->setAddressStreet1($updateParams['addressStreet1']);
        $user->setAddressStreet2($updateParams['addressStreet2']);
        $user->setCity($updateParams['city']);
        $user->setZip($updateParams['zip']);
        $user->setGender($updateParams['gender']);
        $user->setSponsor($updateParams['sponsor']);
        $user->setComment($updateParams['comment']);
        $user->setPhoto($photoPath);

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
        $newParams['firstName']      = $app->escape($request->get('firstName'));
        $newParams['lastName']       = $app->escape($request->get('lastName'));
        $newParams['mail']           = $app->escape($request->get('mail'));
        $newParams['birthdate']      = $app->escape($request->get('birthdate'));
        $newParams['addressStreet1'] = $app->escape($request->get('addressStreet1'));
        $newParams['addressStreet2'] = $app->escape($request->get('addressStreet2'));
        $newParams['city']           = $app->escape($request->get('city'));
        $newParams['zip']            = $app->escape($request->get('zip'));
        $newParams['gender']         = $app->escape($request->get('gender'));

        foreach ($newParams as $value) {
            if (!isset($value)) {
                $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
            }
        }

        $newParams['customId'] = $app->escape($request->get('customId'));
        $newParams['photo']    = $app->escape($request->get('photo'));
        $newParams['sponsor']  = $app->escape($request->get('sponsor'));
        $newParams['comment']  = $app->escape($request->get('comment'));

        $photoPath = '';
        if (!empty($newParams['photo'])) {
            $clientPhotosPath = 'photos/' . $app->escape($request->get('client'));
            if (!file_exists($clientPhotosPath)) {
                mkdir($clientPhotosPath);
            }

            $photoPath = $clientPhotosPath . '/' . uniqid() . '.png';
            list($photoType, $newParams['photo']) = explode(';', $newParams['photo']);
            list(, $newParams['photo'])           = explode(',', $newParams['photo']);
            file_put_contents($photoPath, base64_decode($newParams['photo']));
        }

        $generatedPassword = substr(str_shuffle("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+;:,.?"), 0, 6);

        $user = new User();
        $user->setCustomId($newParams['customId']);
        $user->setFirstName($newParams['firstName']);
        $user->setLastName($newParams['lastName']);
        $user->setPassword(password_hash($generatedPassword, PASSWORD_DEFAULT));
        $user->setMail($newParams['mail']);
        $user->setBirthdate(date('Y-m-d H:i:s', strtotime($newParams['birthdate'])));
        $user->setAddressStreet1($newParams['addressStreet1']);
        $user->setAddressStreet2($newParams['addressStreet2']);
        $user->setCity($newParams['city']);
        $user->setZip($newParams['zip']);
        $user->setGender($newParams['gender']);
        $user->setSponsor($newParams['sponsor']);
        $user->setComment($newParams['comment']);
        $user->setLastSeen('0000-00-00 00:00:00');
        $user->setLastIP('0.0.0.0');
        $user->setSubscriptionDate(date('c'));
        $user->setFailedLogins(0);
        $user->setPhoto($photoPath);
        $app['repository.user']->save($user);

        return json_encode($user, JSON_NUMERIC_CHECK);
    }
}
