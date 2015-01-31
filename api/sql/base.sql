# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Hôte: localhost (MySQL 10.0.15-MariaDB)
# Base de données: gymname
# Temps de génération: 2015-01-31 02:43:47 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Affichage de la table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL DEFAULT '',
  `last_name` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL,
  `mail` varchar(255) NOT NULL DEFAULT '',
  `birthdate` timestamp NULL DEFAULT NULL,
  `gender` tinyint(1) unsigned DEFAULT NULL,
  `last_seen` timestamp NULL DEFAULT NULL,
  `last_ip` varchar(15) NOT NULL DEFAULT '',
  `subscription_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `failed_logins` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`first_name`),
  UNIQUE KEY `email` (`mail`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `first_name`, `last_name`, `password`, `mail`, `birthdate`, `gender`, `last_seen`, `last_ip`, `subscription_date`, `failed_logins`)
VALUES
	(1,'user','','$2y$10$AHlCzRePTRmzTKmb.WbZROznKmHGCpnmjErwfs2NngcYHk1lnVqOG','user@user.user','2015-01-16 10:13:20',NULL,'2015-01-22 19:26:31','http://localhos','2015-01-02 18:43:59',0),
	(2,'modo','','$2y$10$l9IQju8HMi30izZukfkml.ecV/fjLFs5wsEV/gVIiAU.CBfFAh3yK','modo@modo.modo','2015-01-16 10:13:20',NULL,'0000-00-00 00:00:00','127.0.0.1','2015-01-02 18:44:16',0),
	(3,'admin','','$2y$10$sf1krqI89gRZQLo6L5E4aeTqaxa3DXCaZFKaBJ3/Xj2NlpfaZAOxq','admin@admin.admin','2015-01-16 10:13:20',NULL,'2015-01-25 03:25:54','http://127.0.0.','2015-01-02 18:44:32',0);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table users_access
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users_access`;

CREATE TABLE `users_access` (
  `user_id` int(11) unsigned NOT NULL,
  `user_level` tinyint(1) unsigned NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `users_access_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users_access` WRITE;
/*!40000 ALTER TABLE `users_access` DISABLE KEYS */;

INSERT INTO `users_access` (`user_id`, `user_level`)
VALUES
	(2,1),
	(3,2);

/*!40000 ALTER TABLE `users_access` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table users_avatar
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users_avatar`;

CREATE TABLE `users_avatar` (
  `user_id` int(11) unsigned NOT NULL,
  `image` blob NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `added_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `users_avatar_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
