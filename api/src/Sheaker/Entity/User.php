<?php

namespace Sheaker\Entity;

class User
{
    /**
     * User id.
     *
     * @var integer
     */
    public $id;

    /**
     * First Name.
     *
     * @var string
     */
    public $firstName;

    /**
     * Last Name.
     *
     * @var string
     */
    public $lastName;

    /**
     * Password.
     *
     * @var integer
     */
    public $password;

    /**
     * Email.
     *
     * @var string
     */
    public $mail;

    /**
     * Access.
     *
     * @var integer
     */
    public $userLevel;

    /**
     * When the user entity was born.
     *
     * @var DateTime
     */
    public $birthdate;

    /**
     * What kind of person is the user entity.
     *
     * @var integer
     */
    public $gender;

    /**
     * When the user entity was last seen.
     *
     * @var DateTime
     */
    public $lastSeen;

    /**
     * The last IP of the user.
     *
     * @var String
     */
    public $lastIP;

    /**
     * When the user entity was created.
     *
     * @var DateTime
     */
    public $subscriptionDate;

    /**
     * Number of failed login for this user.
     *
     * @var integer
     */
    public $failedLogins;

    /**
     * Sponsor id.
     *
     * @var integer
     */
    public $sponsor;

    /**
     * Comment on the user.
     *
     * @var String
     */
    public $comment;


    public function getId()
    {
        return $this->id;
    }
    public function setId($id)
    {
        return $this->id = $id;
    }

    public function getFirstName()
    {
        return $this->firstName;
    }
    public function setFirstName($firstName)
    {
        $this->firstName = $firstName;
    }

    public function getLastName()
    {
        return $this->lastName;
    }
    public function setLastName($lastName)
    {
        $this->lastName = $lastName;
    }

    public function getPassword()
    {
        return $this->password;
    }
    public function setPassword($password)
    {
        $this->password = $password;
    }

    public function getMail()
    {
        return $this->mail;
    }
    public function setMail($mail)
    {
        $this->mail = $mail;
    }

    public function getUserLevel()
    {
        return $this->userLevel;
    }
    public function setUserLevel($userLevel)
    {
        $this->userLevel = $userLevel;
    }

    public function getBirthdate()
    {
        return $this->birthdate;
    }
    public function setBirthdate(\DateTime $birthdate)
    {
        $this->birthdate = $birthdate;
    }

    public function getGender()
    {
        return $this->gender;
    }
    public function setGender($gender)
    {
        $this->gender = $gender;
    }

    public function getLastSeen()
    {
        return $this->lastSeen;
    }
    public function setLastSeen(\DateTime $lastSeen)
    {
        $this->lastSeen = $lastSeen;
    }

    public function getLastIP()
    {
        return $this->lastIP;
    }
    public function setLastIP($lastIP)
    {
        $this->lastIP = $lastIP;
    }

    public function getSubscriptionDate()
    {
        return $this->subscriptionDate;
    }
    public function setSubscriptionDate(\DateTime $subscriptionDate)
    {
        $this->subscriptionDate = $subscriptionDate;
    }

    public function getFailedLogins()
    {
        return $this->failedLogins;
    }
    public function setFailedLogins($failedLogins)
    {
        $this->failedLogins = $failedLogins;
    }

    public function getSponsor()
    {
        return $this->sponsor;
    }
    public function setSponsor($sponsor)
    {
        $this->sponsor = $sponsor;
    }

    public function getComment()
    {
        return $this->comment;
    }
    public function setComment($comment)
    {
        $this->comment = $comment;
    }
}
