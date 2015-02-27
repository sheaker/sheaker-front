<?php

namespace Sheaker\Controller;

use Sheaker\Entity\UserPayment;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class UserPaymentController
{
    public function historyPayments(Request $request, Application $app)
    {
        $token = $app['jwt']->checkIfTokenIsPresentAndLikeAVirgin($request);

        if (!in_array('admin', $token->user->permissions) && !in_array('modo', $token->user->permissions)) {
            $app->abort(Response::HTTP_FORBIDDEN, 'Forbidden');
        }

        $historyParams['userId'] = $app->escape($request->get('id'));

        foreach($historyParams as $value) {
            if (!isset($value)) {
                $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
            }
        }

        $offset = 0;
        $limit = 200;
        $users = $app['repository.userPayment']->findAllByUser($historyParams['userId'], $limit, $offset, array('payment_date' => 'DESC'));

        return json_encode(array_values($users), JSON_NUMERIC_CHECK);
    }

    public function charge(Request $request, Application $app)
    {
        $token = $app['jwt']->checkIfTokenIsPresentAndLikeAVirgin($request);

        if (!in_array('admin', $token->user->permissions) && !in_array('modo', $token->user->permissions)) {
            $app->abort(Response::HTTP_FORBIDDEN, 'Forbidden');
        }

        $chargeParams = [];
        $chargeParams['userId']    = $app->escape($request->get('id'));
        $chargeParams['days']      = $app->escape($request->get('days'));
        $chargeParams['startDate'] = $app->escape($request->get('startDate'));
        $chargeParams['price']     = $app->escape($request->get('price'));
        $chargeParams['method']    = $app->escape($request->get('method'));

        foreach($chargeParams as $value) {
            if (!isset($value)) {
                $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
            }
        }

        $chargeParams['comment'] = $app->escape($request->get('comment'));

        $userPayment = new UserPayment();
        $userPayment->setUserID($chargeParams['userId']);
        $userPayment->setDays($chargeParams['days']);
        $userPayment->setStartDate(date('Y-m-d H:i:s', strtotime($chargeParams['startDate'])));
        $userPayment->setComment($chargeParams['comment']);
        $userPayment->setPrice($chargeParams['price']);
        $userPayment->setMethod($chargeParams['method']);
        $app['repository.userPayment']->save($userPayment);

        return json_encode($userPayment, JSON_NUMERIC_CHECK);
    }
}
