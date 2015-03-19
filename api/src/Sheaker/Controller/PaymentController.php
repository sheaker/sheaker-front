<?php

namespace Sheaker\Controller;

use Sheaker\Entity\Payment;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class PaymentController
{
    public function getPaymentsList(Request $request, Application $app)
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

        $users = $app['repository.payment']->findAllByUser($getParams['userId'], $getParams['limit'], $getParams['offset'], array($getParams['sortBy'] => $getParams['order']));

        return json_encode(array_values($users), JSON_NUMERIC_CHECK);
    }

    public function addPayment(Request $request, Application $app)
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

        $user = $app['repository.user']->findById($paymentData['user_id']);

        $payment = new UserPayment();
        $payment->setUser($user);
        $payment->setDays($addParams['days']);
        $payment->setStartDate(date('Y-m-d H:i:s', strtotime($addParams['startDate'])));
        $payment->setComment($addParams['comment']);
        $payment->setPrice($addParams['price']);
        $payment->setMethod($addParams['method']);
        $payment->setPaymentDate(date('c'));
        $app['repository.payment']->save($payment);

        return json_encode($payment, JSON_NUMERIC_CHECK);
    }
}
