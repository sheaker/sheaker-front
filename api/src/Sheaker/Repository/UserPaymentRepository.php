<?php

namespace Sheaker\Repository;

use Doctrine\DBAL\Connection;
use Sheaker\Entity\UserPayment;

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
            'user_id'    => $user->getUserId(),
            'days'       => $user->getDays(),
            'start_date' => $user->getStartDate(),
            'comment'    => $user->getComment(),
            'price'      => $user->getPrice(),
            'method'     => $user->getMethod(),
        );

        $this->db->insert('users_payments', $userData);
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
            FROM users_payments up
            WHERE id = ?', array($id));
        return $userData ? $this->buildPaymentUser($userData) : FALSE;
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
        return $this->getPayments(array(), $limit, $offset, $orderBy);
    }

    /**
     * Returns a collection of payments.
     *
     * @param integer $userId
     *   The user Id
     * @param integer $limit
     *   The number of users to return.
     * @param integer $offset
     *   The number of users to skip.
     * @param array $orderBy
     *   Optionally, the order by info, in the $column => $direction format.
     *
     * @return array A collection of users, keyed by user id.
     */
    public function findAllByUser($userId, $limit, $offset = 0, $orderBy = array())
    {
        $conditions = array(
            'user_id' => $userId
        );

        return $this->getPayments($conditions, $limit, $offset, $orderBy);
    }

    public function delete($id)
    {
    }

    public function getCount()
    {
    }

    /**
     * Returns a collection of payments.
     *
     * @param integer $limit
     *   The number of users to return.
     * @param integer $offset
     *   The number of users to skip.
     * @param array $orderBy
     *   Optionally, the order by info, in the $column => $direction format.
     *
     * @return array A collection of payments.
     */
    public function getPayments($conditions, $limit, $offset = 0, $orderBy = array())
    {
        // Provide a default orderBy.
        if (!$orderBy) {
            $orderBy = array('user_id' => 'ASC');
        }

        $queryBuilder = $this->db->createQueryBuilder();
        $queryBuilder
            ->select('up.*')
            ->from('users_payments', 'up')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->orderBy('up.' . key($orderBy), current($orderBy));
        $parameters = array();
        foreach ($conditions as $key => $value) {
            $parameters[':' . $key] = $value;
            $where = $queryBuilder->expr()->eq('up.' . $key, ':' . $key);
            $queryBuilder->andWhere($where);
        }
        $queryBuilder->setParameters($parameters);
        $statement = $queryBuilder->execute();
        $paymentsData = $statement->fetchAll();

        $payments = array();
        foreach ($paymentsData as $paymentData) {
            array_push($payments, $this->buildPayment($paymentData));
        }
        return $payments;
    }

    /**
     * Instantiates a user entity and sets its properties using db data.
     *
     * @param array $userData
     *   The array of db data.
     *
     * @return \Sheaker\Entity\User
     */
    protected function buildPayment($paymentData)
    {
        $userPayment = new UserPayment();
        $userPayment->setUserId($paymentData['user_id']);
        $userPayment->setDays($paymentData['days']);
        $userPayment->setStartDate(date('c', strtotime($paymentData['created_at'])));
        $userPayment->setComment((isset($paymentData['comment'])) ? $paymentData['comment'] : '');
        $userPayment->setPrice($paymentData['price']);
        $userPayment->setMethod($paymentData['method']);
        $userPayment->setPaymentDate(date('c', strtotime($paymentData['created_at'])));
        return $userPayment;
    }
}
