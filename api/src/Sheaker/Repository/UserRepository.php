<?php

namespace Sheaker\Repository;

use Doctrine\DBAL\Connection;
use Sheaker\Entity\User;

/**
 * User repository
 */
class UserRepository implements RepositoryInterface
{
    /**
     * @var \Doctrine\DBAL\Connection
     */
    protected $db;

    public function __construct(Connection $db)
    {
        $this->db = $db;
    }

    /**
     * Saves the user to the database.
     *
     * @param \Sheaker\Entity\User $user
     */
    public function save($user)
    {
        $userData = array(
            'first_name'    => $user->getFirstName(),
            'last_name'     => $user->getLastName(),
            'password'      => $user->getPassword(),
            'mail'          => $user->getMail(),
            'birthdate'     => $user->getBirthdate()->format('Y-m-d G:i:s'),
            'gender'        => $user->getGender(),
            'last_seen'     => $user->getLastSeen()->format('Y-m-d G:i:s'),
            'last_ip'       => $user->getLastIP(),
            'failed_logins' => $user->getFailedLogins()
        );

        $userExtraInfoData = array(
            'sponsor_id' => $user->getSponsor(),
            'comment'    => $user->getComment()
        );

        $userPhotoData = array(
            'image' => $user->getPhoto()
        );

        if ($user->getId()) {
            $this->db->update('users', $userData, array('id' => $user->getId()));
            $this->db->update('users_photo', $userPhoto, array('user_id' => $user->getId()));
            //$this->db->update('users_extrainfo', $userExtraInfoData, array('user_id' => $user->getId()));
        } else {
            $this->db->insert('users', $userData);
            $user->setId($this->db->lastInsertId());

            $this->db->insert('users_photo', array_merge(['user_id' => $user->getId()], $userPhotoData));

            if (isset($userExtraInfoData['sponsor_id']) || isset($userExtraInfoData['comment']))
                $this->db->insert('users_extrainfo', array_merge(['user_id' => $user->getId()], $userExtraInfoData));
        }
    }

    /**
     * Returns a user matching the supplied id.
     *
     * @param integer $id
     *
     * @return \Sheaker\Entity\User|false An entity object if found, false otherwise.
     */
    public function find($id)
    {
        $userData = $this->db->fetchAssoc('SELECT * FROM users u JOIN users_access ua ON ua.user_id = u.id WHERE id = ?', array($id));
        return $userData ? $this->buildUser($userData) : FALSE;
    }

    /**
     * Returns a collection of users.
     *
     * @param integer $limit
     *   The number of users to return.
     * @param integer $offset
     *   The number of users to skip.
     * @param array $orderBy
     *   Optionally, the order by info, in the $column => $direction format.
     *
     * @return array A collection of users, keyed by user id.
     */
    public function findAll($limit, $offset = 0, $orderBy = array())
    {
        // Provide a default orderBy.
        if (!$orderBy) {
            $orderBy = array('id' => 'ASC');
        }

        $queryBuilder = $this->db->createQueryBuilder();
        $queryBuilder
            ->select('u.*')
            ->from('users', 'u')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->orderBy('u.' . key($orderBy), current($orderBy));
        $statement = $queryBuilder->execute();
        $usersData = $statement->fetchAll();

        $users = array();
        foreach ($usersData as $userData) {
            $userId = $userData['id'];
            $users[$userId] = $this->buildUser($userData);
        }

        return $users;
    }

    public function delete($id)
    {
    }

    public function getCount()
    {
    }

    /**
     * Instantiates a user entity and sets its properties using db data.
     *
     * @param array $userData
     *   The array of db data.
     *
     * @return \Sheaker\Entity\User
     */
    protected function buildUser($userData)
    {
        $user = new User();
        $user->setId($userData['id']);
        $user->setFirstName($userData['first_name']);
        $user->setLastName($userData['last_name']);
        $user->setPassword($userData['password']);
        $user->setMail($userData['mail']);
        $user->setBirthdate(new \DateTime(date("Y-m-d H:i:s", strtotime($userData['birthdate']))));
        $user->setGender($userData['gender']);
        $user->setLastSeen(new \DateTime(date("Y-m-d H:i:s", strtotime($userData['last_seen']))));
        $user->setLastIP($userData['last_ip']);
        $user->setSubscriptionDate(new \DateTime(date("Y-m-d H:i:s", strtotime($userData['subscription_date']))));
        $user->setFailedLogins($userData['failed_logins']);
        $user->setUserLevel((isset($userData['user_level'])) ? $userData['user_level'] : 0);

        return $user;
    }
}
