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
            'birthdate'     => $user->getBirthdate(),
            'gender'        => $user->getGender(),
            'last_seen'     => $user->getLastSeen(),
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

            if (!empty($userPhotoData['image'])) {
                $this->db->update('users_photo', $userPhotoData, array('user_id' => $user->getId()));
            }

            if (!empty($userExtraInfoData['sponsor_id']) || !empty($userExtraInfoData['comment'])) {
                $this->db->update('users_extrainfo', $userExtraInfoData, array('user_id' => $user->getId()));
            }
        } else {
            $this->db->insert('users', $userData);
            $user->setId($this->db->lastInsertId());

            if (!empty($userPhotoData['image'])) {
                $this->db->insert('users_photo', array_merge(['user_id' => $user->getId()], $userPhotoData));
            }

            if (!empty($userExtraInfoData['sponsor_id']) || !empty($userExtraInfoData['comment'])) {
                $this->db->insert('users_extrainfo', array_merge(['user_id' => $user->getId()], $userExtraInfoData));
            }
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
        $userData = $this->db->fetchAssoc('
            SELECT *
            FROM users u
            LEFT JOIN users_access ua ON ua.user_id = u.id
            LEFT JOIN users_photo up ON up.user_id = u.id
            LEFT JOIN users_extrainfo uei ON uei.user_id = u.id
            WHERE id = ?', array($id));
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
        return $this->getUsers(array(), $limit, $offset, $orderBy);
    }

    public function delete($id)
    {
    }

    public function getCount()
    {
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
    public function getUsers($conditions, $limit, $offset = 0, $orderBy = array())
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
        $parameters = array();
        foreach ($conditions as $key => $value) {
            $parameters[':' . $key] = $value;
            $where = $queryBuilder->expr()->eq('u.' . $key, ':' . $key);
            $queryBuilder->andWhere($where);
        }
        $queryBuilder->setParameters($parameters);
        $statement = $queryBuilder->execute();
        $usersData = $statement->fetchAll();

        $users = array();
        foreach ($usersData as $userData) {
            $userId = $userData['id'];
            $users[$userId] = $this->buildUser($userData);
        }

        return $users;
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
        $user->setBirthdate($userData['birthdate']);
        $user->setGender($userData['gender']);
        $user->setLastSeen(date('Y-m-d H:i:s', strtotime($userData['last_seen'])));
        $user->setLastIP($userData['last_ip']);
        $user->setSubscriptionDate(date('Y-m-d H:i:s', strtotime($userData['subscription_date'])));
        $user->setFailedLogins($userData['failed_logins']);
        $user->setPhoto((isset($userData['image'])) ? $userData['image'] : '');
        $user->setUserLevel((isset($userData['user_level'])) ? $userData['user_level'] : 0);
        $user->setSponsor((isset($userData['sponsor_id'])) ? $userData['sponsor_id'] : '');
        $user->setComment((isset($userData['comment'])) ? $userData['comment'] : '');

        return $user;
    }
}
