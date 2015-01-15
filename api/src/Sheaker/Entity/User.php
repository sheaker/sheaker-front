<?php

namespace Sheaker\Entity;

class User
{
    /*
     * User id.
     *
     * @var integer
     */
    protected $id;

    /*
     * Username.
     *
     * @var string
     */
    protected $username;

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }
}
