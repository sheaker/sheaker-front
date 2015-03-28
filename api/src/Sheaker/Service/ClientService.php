<?php

namespace Sheaker\Service;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Provides a way to handle Sheaker Client
 */
class ClientService
{
    /**
     * @var Application
     */
    protected $app;

    protected $client;

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->client = null;
    }

    public function fetchClient(Request $request)
    {
        $getParams = [];
        if ($request->get('subdomain'))
            $getParams['subdomain'] = $this->app->escape($request->get('subdomain'));
        else if ($request->get('id_client'))
            $getParams['id_client'] = $this->app->escape($request->get('id_client'));
        else
            $this->app->abort(Response::HTTP_UNAUTHORIZED, 'No client specified');

        $key = key($getParams);
        $value = $getParams[key($getParams)];

        // Fetch client informtions from Sheaker API
        $ch = curl_init($this->app['sheaker.api'] . "/clients?{$key}={$value}");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $client = json_decode(curl_exec($ch));
        curl_close($ch);

        $this->client = $client;
    }

    public function getClient()
    {
        return $this->client;
    }
}
