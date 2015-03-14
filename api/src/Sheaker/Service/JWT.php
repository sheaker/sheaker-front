<?php

namespace Sheaker\Service;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Provides a way to handle JWT a bit more properly
 */
class JWT
{
    /**
     * @var Application
     */
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    public function createToken(Request $request, $exp, $user)
    {
        $idClient = $this->app->escape($request->get('client'));
        if (!isset($idClient)) {
            $this->app->abort(Response::HTTP_UNAUTHORIZED, 'No client specified');
        }

        $payload = [
            'iss' => $request->headers->get('referer'),
            'iat' => time(),
            'exp' => $exp,
            'user' => $user
        ];

        // Retrieve the secret key on Sheaker API to encode the token
        $ch = curl_init("http://sheaker.com/api/clients?id={$idClient}");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $client = json_decode(curl_exec($ch));
        curl_close($ch);

        $token = \JWT::encode($payload, $client->secretKey);

        return $token;
    }

    public function checkIfTokenIsPresentAndLikeAVirgin(Request $request)
    {
        // Authorization shouldn't being able to be retrieve here, but rewrite magic happen in vhost configuration
        $authorizationHeader = $request->headers->get('Authorization');
        if ($authorizationHeader == null) {
            $this->app->abort(Response::HTTP_UNAUTHORIZED, 'No authorization header sent');
        }

        $idClient = $this->app->escape($request->get('client'));
        if (!isset($idClient)) {
            $this->app->abort(Response::HTTP_UNAUTHORIZED, 'No client specified');
        }

        // Retrieve the secret key on Sheaker API to encode the token
        $ch = curl_init("http://sheaker.com/api/clients?id={$idClient}");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $client = json_decode(curl_exec($ch));
        curl_close($ch);

        // $authorizationHeader should be in that form: Bearer THE_TOKEN
        $token = explode(' ', $authorizationHeader)[1];
        try {
            $decoded_token = \JWT::decode($token, $client->secretKey);
        }
        catch (UnexpectedValueException $ex) {
            $this->app->abort(Response::HTTP_UNAUTHORIZED, 'Invalid token');
        }

        return $decoded_token;
    }
}
