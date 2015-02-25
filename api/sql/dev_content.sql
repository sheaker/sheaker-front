# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Hôte: localhost (MySQL 10.0.16-MariaDB)
# Base de données: gymname
# Temps de génération: 2015-02-25 18:30:25 +0000
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

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `first_name`, `last_name`, `password`, `mail`, `birthdate`, `gender`, `last_seen`, `last_ip`, `subscription_date`, `failed_logins`)
VALUES
	(1,'user','','$2y$10$AHlCzRePTRmzTKmb.WbZROznKmHGCpnmjErwfs2NngcYHk1lnVqOG','user@user.user','2015-01-16 10:13:20',0,'0000-00-00 00:00:00','0.0.0.0','2015-01-02 18:43:59',0),
	(2,'modo','','$2y$10$l9IQju8HMi30izZukfkml.ecV/fjLFs5wsEV/gVIiAU.CBfFAh3yK','modo@modo.modo','2015-01-16 10:13:20',0,'0000-00-00 00:00:00','0.0.0.0','2015-01-02 18:44:16',0),
	(3,'admin','','$2y$10$sf1krqI89gRZQLo6L5E4aeTqaxa3DXCaZFKaBJ3/Xj2NlpfaZAOxq','admin@admin.admin','2015-01-16 10:13:20',0,'2015-02-25 05:56:31','http://localhos','2015-01-02 18:44:32',0),
	(4,'kevin','darcel','$2y$10$daUTTc4yiSZ2Nn2GJt./UeU/51CydHrdYjOTURLkGhREQS1OeZS4q','kevin.darcel@gmail.com','1990-08-01 08:00:00',0,'0000-00-00 00:00:00','0.0.0.0','2015-02-21 16:32:55',0),
	(5,'armoud','mohamed','$2y$10$jzx3QOZpFpskoappQ17H4up1KWVwXik1uu.7W5jV/VAEMOYME4bVW','hgvygfv@htfgjhbjhsdas','2015-02-05 07:00:00',1,'0000-00-00 00:00:00','0.0.0.0','2015-02-24 10:05:32',0),
	(13,'claudia','patate','$2y$10$PPwtP0lR9HdX2octJPi02.RKO4hDoA2afqsvAbSVKgaVSKQSJv5Va','claudia.patate@gmail.com','2015-02-05 07:00:00',1,'0000-00-00 00:00:00','0.0.0.0','2015-02-24 11:06:28',0);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table users_access
# ------------------------------------------------------------

LOCK TABLES `users_access` WRITE;
/*!40000 ALTER TABLE `users_access` DISABLE KEYS */;

INSERT INTO `users_access` (`user_id`, `user_level`)
VALUES
	(2,1),
	(3,2);

/*!40000 ALTER TABLE `users_access` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table users_extrainfo
# ------------------------------------------------------------

LOCK TABLES `users_extrainfo` WRITE;
/*!40000 ALTER TABLE `users_extrainfo` DISABLE KEYS */;

INSERT INTO `users_extrainfo` (`user_id`, `sponsor_id`, `comment`)
VALUES
	(13,4,'- Je suis une patate');

/*!40000 ALTER TABLE `users_extrainfo` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table users_photo
# ------------------------------------------------------------




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
