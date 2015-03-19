<?php

namespace Sheaker\Controller;

use Sheaker\Entity\UserPayment;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class UserPaymentController
{
    public function getUserPaymentsList(Request $request, Application $app)
    {
        $token = $app['jwt']->checkIfTokenIsPresentAndLikeAVirgin($request);

        if (!in_array('admin', $token->user->permissions) && !in_array('modo', $token->user->permissions)) {
            $app->abort(Response::HTTP_FORBIDDEN, 'Forbidden');
        }

        $getParams = [];
        $getParams['userId'] = $app->escape($request->get('id'));

        foreach ($getParams as $value) {
            if (!isset($value)) {
                $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
            }
        }

        $getParams['limit']  = $app->escape($request->get('limit',  200));
        $getParams['offset'] = $app->escape($request->get('offset', 0));
        $getParams['sortBy'] = $app->escape($request->get('sortBy', 'payment_date'));
        $getParams['order']  = $app->escape($request->get('order',  'DESC'));

        $users = $app['repository.userPayment']->findAllByUser($getParams['userId'], $getParams['limit'], $getParams['offset'], array($getParams['sortBy'] => $getParams['order']));

        return json_encode(array_values($users), JSON_NUMERIC_CHECK);
    }

    public function addUserPayment(Request $request, Application $app)
    {
        $token = $app['jwt']->checkIfTokenIsPresentAndLikeAVirgin($request);

        if (!in_array('admin', $token->user->permissions) && !in_array('modo', $token->user->permissions)) {
            $app->abort(Response::HTTP_FORBIDDEN, 'Forbidden');
        }

        $addParams = [];
        $addParams['userId']    = $app->escape($request->get('id'));
        $addParams['days']      = $app->escape($request->get('days'));
        $addParams['startDate'] = $app->escape($request->get('startDate'));
        $addParams['price']     = $app->escape($request->get('price'));
        $addParams['method']    = $app->escape($request->get('method'));

        foreach ($addParams as $value) {
            if (!isset($value)) {
                $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
            }
        }

        $addParams['comment'] = $app->escape($request->get('comment'));

        $userPayment = new UserPayment();
        $userPayment->setUserId($addParams['userId']);
        $userPayment->setDays($addParams['days']);
        $userPayment->setStartDate(date('Y-m-d H:i:s', strtotime($addParams['startDate'])));
        $userPayment->setComment($addParams['comment']);
        $userPayment->setPrice($addParams['price']);
        $userPayment->setMethod($addParams['method']);
        $userPayment->setPaymentDate(date('c'));
        $app['repository.userPayment']->save($userPayment);

        return json_encode($userPayment, JSON_NUMERIC_CHECK);
    }
}
