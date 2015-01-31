<?php

namespace Sheaker\Entity;

class User
{
    /**
     * User id.
     *
     * @var integer
     */
    protected $id;

    /**
     * First Name.
     *
     * @var string
     */
    protected $firstName;

    /**
     * Last Name.
     *
     * @var string
     */
    protected $lastName;

    /**
     * Password.
     *
     * @var integer
     */
    protected $password;

    /**
     * Email.
     *
     * @var string
     */
    protected $mail;

    /**
     * Access.
     *
     * @var integer
     */
    protected $userLevel;

    /**
     * When the user entity was born.
     *
     * @var DateTime
     */
    protected $birthdate;

    /**
     * What kind of person is the user entity.
     *
     * @var integer
     */
    protected $gender;

    /**
     * When the user entity was last seen.
     *
     * @var DateTime
     */
    protected $lastSeen;

    /**
     * The last IP of the user.
     *
     * @var String
     */
    protected $lastIP;

    /**
     * When the user entity was created.
     *
     * @var DateTime
     */
    protected $subscriptionDate;

    /**
     * Number of failed login for this user.
     *
     * @var integer
     */
    protected $failedLogins;

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
        return $this->subcriptionDate;
    }
    public function setSubscriptionDate(\DateTime $subcriptionDate)
    {
        $this->subcriptionDate = $subcriptionDate;
    }

    public function getFailedLogins()
    {
        return $this->failedLogins;
    }
    public function setFailedLogins($failedLogins)
    {
        $this->failedLogins = $failedLogins;
    }
}
