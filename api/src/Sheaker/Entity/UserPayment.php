<?php

namespace Sheaker\Entity;

class UserPayment
{
    /**
     * User id.
     *
     * @var integer
     */
    public $userId;

    /**
     * Number of days of the subscription.
     *
     * @var integer
     */
    public $daysNumber;

    /**
     * First day of subscription.
     *
     * @var string
     */
    public $departureDate;

    /**
     * Special Comment.
     *
     * @var string
     */
    public $comment;

    /**
     * Amount of subscription.
     *
     * @var integer
     */
    public $amount;

    /**
     * Payment method.
     *
     * @var integer
     */
    public $paymentMethod;

    public function getUserId()
    {
        return $this->userId;
    }
    public function setUserId($userId)
    {
        return $this->userId = $userId;
    }

    public function getDaysNumber()
    {
        return $this->daysNumber;
    }
    public function setDaysNumber($daysNumber)
    {
        $this->daysNumber = $daysNumber;
    }

    public function getDepartureDate()
    {
        return $this->departureDate;
    }
    public function setDepartureDate($departureDate)
    {
        $this->departureDate = $departureDate;
    }

    public function getComment()
    {
        return $this->comment;
    }
    public function setComment($comment)
    {
        $this->comment = $comment;
    }

    public function getAmount()
    {
        return $this->amount;
    }
    public function setAmount($amount)
    {
        $this->amount = $amount;
    }

    public function getPaymentMethod()
    {
        return $this->paymentMethod;
    }
    public function setPaymentMethod($paymentMethod)
    {
        $this->paymentMethod = $paymentMethod;
    }
}
