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
    public $days;

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
     * Price of the subscription.
     *
     * @var integer
     */
    public $price;

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

    public function getDays()
    {
        return $this->days;
    }
    public function setDays($days)
    {
        $this->days = $days;
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

    public function getPrice()
    {
        return $this->price;
    }
    public function setPrice($price)
    {
        $this->price = $price;
    }

    public function getMethod()
    {
        return $this->method;
    }
    public function setMethod($method)
    {
        $this->method = $method;
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
