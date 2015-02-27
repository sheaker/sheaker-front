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

        $id = $app->escape($request->get('id'));
        $offset = 0;
        $limit = 200;
        $users = $app['repository.userPayment']->findAll($id, $limit, $offset, array('payment_date' => 'DESC'));

        return json_encode(array_values($users), JSON_NUMERIC_CHECK);
    }

    public function charge(Request $request, Application $app)
    {
        $token = $app['jwt']->checkIfTokenIsPresentAndLikeAVirgin($request);

        if (!in_array('admin', $token->user->permissions) && !in_array('modo', $token->user->permissions)) {
            $app->abort(Response::HTTP_FORBIDDEN, 'Forbidden');
        }

        $chargeUser = [];
        $chargeUser['userId']           = $app->escape($request->get('id'));
        $chargeUser['numberOfDays']     = $app->escape($request->get('numberOfDays'));
        $chargeUser['startDate']        = $app->escape($request->get('startDate'));
        $chargeUser['comment']          = $app->escape($request->get('comment'));
        $chargeUser['amount']           = $app->escape($request->get('amount'));
        $chargeUser['paymentMethod']    = $app->escape($request->get('paymentMethod'));

        foreach($chargeUser as $value) {
            if (!isset($value)) {
                $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
            }
        }

        $chargeUser['comment']          = $app->escape($request->get('comment'));

        $userPayment = new UserPayment();
        $userPayment->setUserID($chargeUser['userId']);
        $userPayment->setDaysNumber($chargeUser['numberOfDays']);
        $userPayment->setStartDate(date('Y-m-d H:i:s', strtotime($chargeUser['startDate'])));
        $userPayment->setComment($chargeUser['comment']);
        $userPayment->setAmount($chargeUser['amount']);
        $userPayment->setPaymentMethod($chargeUser['paymentMethod']);

        $app['repository.userPayment']->save($userPayment);

        return json_encode($userPayment, JSON_NUMERIC_CHECK);
    }
}
