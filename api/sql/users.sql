-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           5.5.40 - MySQL Community Server (GPL)
-- Serveur OS:                   Win64
-- HeidiSQL Version:             8.3.0.4694
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Export de la structure de table gymname. users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `custom_id` int(11) unsigned NOT NULL DEFAULT '0',
  `first_name` varchar(255) NOT NULL DEFAULT '',
  `last_name` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL,
  `mail` varchar(255) NOT NULL DEFAULT '',
  `birthdate` date NOT NULL,
  `adress_street_1` varchar(255) NOT NULL,
  `adress_street_2` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `zip` int(11) unsigned NOT NULL,
  `gender` tinyint(1) unsigned NOT NULL,
  `last_seen` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `last_ip` varchar(15) NOT NULL DEFAULT '0.0.0.0',
  `subscription_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `failed_logins` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- L'exportation de données n'été pas sélectionné.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
