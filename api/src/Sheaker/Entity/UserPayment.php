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
    public $startDate;

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

    /**
     * When the user entity was created.
     *
     * @var string
     */
    public $paymentDate;

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

    public function getStartDate()
    {
        return $this->startDate;
    }
    public function setStartDate($startDate)
    {
        $this->startDate = $startDate;
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

    public function getPaymentDate()
    {
        return $this->paymentDate;
    }
    public function setPaymentDate($paymentDate)
    {
        $this->paymentDate = $paymentDate;
    }
}
