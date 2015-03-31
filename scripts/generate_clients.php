<?php

$dbh = new PDO('mysql:host=localhost;dbname=client_gym4devs', 'root', '');

define('CLIENTS', 1000);
define('CLIENTS_PAYMENTS', 12);


for ($iUsers = 1; $iUsers <= CLIENTS; $iUsers++) {
    echo "Joe-{$iUsers}\n";
    sleep(1);
    $stmt = $dbh->prepare("INSERT INTO users (first_name, last_name, password) VALUES (:f, :l, '1OhuHu9HVMGnsyEEGXt6Y6QShwL7ZM')");
    $stmt->bindValue(':f', "Joe-{$iUsers}", PDO::PARAM_STR);
    $stmt->bindValue(':l', "Biggles-{$iUsers}", PDO::PARAM_STR);
    $stmt->execute();

    $userId = $dbh->lastInsertId();

    for ($iPayments = 1; $iPayments <= CLIENTS_PAYMENTS; $iPayments++) {
        $stmt = $dbh->prepare("INSERT INTO users_payments (user_id, days, start_date, price, method) VALUES (:user_id, 30, :start_date, 500, 0)");
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':start_date', "2015-{$iPayments}-01 00:00:00", PDO::PARAM_INT);
        $stmt->execute();
    }
}
