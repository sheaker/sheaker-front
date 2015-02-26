<?php

namespace Sheaker\Repository;

use Doctrine\DBAL\Connection;
use Sheaker\Entity\User;

/**
 * User repository
 */
class UserPaymentRepository implements RepositoryInterface
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
            'user_id'           => $user->getUserId(),
            'days_number'       => $user->getDaysNumber(),
            'departure_date'    => $user->getDepartureDate(),
            'comment'           => $user->getComment(),
            'amount'            => $user->getAmount(),
            'payment_method'    => $user->getPaymentMethod(),
        );

        $this->db->insert('users_charge', $userData);
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
            FROM users_charge up
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
        // Provide a default orderBy.
        if (!$orderBy) {
            $orderBy = array('id' => 'ASC');
        }

        $queryBuilder = $this->db->createQueryBuilder();
        $queryBuilder
            ->select('up.*')
            ->from('users_charge', 'up')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->orderBy('u.' . key($orderBy), current($orderBy));
        $statement = $queryBuilder->execute();
        $usersData = $statement->fetchAll();

        $users = array();
        foreach ($usersData as $userData) {
            $userId = $userData['user_id'];
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
    protected function buildChargeUser($userData)
    {
        $user = new UserPayment();
        $user->setUserId($userData['user_id']);
        $user->setDaysNumber($userData['days_number']);
        $user->setDepartureDate($userData['departure_date']);
        $user->setComment($userData['comment']);
        $user->setAmount($userData['amount']);
        $user->setPaymentMethod($userData['payment_method']);
        return $user;
    }
}
