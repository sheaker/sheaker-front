#
# SQL Export
# Created by Querious (962)
# Created: April 3, 2015 at 9:01:56 AM CST
# Encoding: Unicode (UTF-8)
#


DROP TABLE IF EXISTS `users_payments`;
DROP TABLE IF EXISTS `users_access`;
DROP TABLE IF EXISTS `users`;


CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `custom_id` int(11) unsigned DEFAULT NULL,
  `first_name` varchar(255) NOT NULL DEFAULT '',
  `last_name` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL,
  `phone` varchar(128) DEFAULT NULL,
  `mail` varchar(255) DEFAULT '',
  `birthdate` date DEFAULT NULL,
  `address_street_1` varchar(255) DEFAULT '',
  `address_street_2` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `zip` int(11) unsigned DEFAULT NULL,
  `gender` tinyint(1) DEFAULT '-1',
  `sponsor_id` int(11) unsigned DEFAULT NULL,
  `comment` text,
  `failed_logins` int(11) unsigned NOT NULL DEFAULT '0',
  `last_seen` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `last_ip` varchar(255) NOT NULL DEFAULT '0.0.0.0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;


CREATE TABLE `users_access` (
  `user_id` int(11) unsigned NOT NULL,
  `user_level` tinyint(1) unsigned NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `idx_user_id` (`user_id`) USING BTREE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `users_payments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL DEFAULT '0',
  `days` smallint(5) NOT NULL DEFAULT '-1',
  `start_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `end_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `price` smallint(5) NOT NULL DEFAULT '-1',
  `method` tinyint(3) NOT NULL DEFAULT '-1',
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`) USING BTREE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




SET @PREVIOUS_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;


LOCK TABLES `users` WRITE;
ALTER TABLE `users` DISABLE KEYS;
INSERT INTO `users` (`id`, `custom_id`, `first_name`, `last_name`, `password`, `phone`, `mail`, `birthdate`, `address_street_1`, `address_street_2`, `city`, `zip`, `gender`, `sponsor_id`, `comment`, `failed_logins`, `last_seen`, `last_ip`, `created_at`) VALUES 
	(1,0,'admin','admin','$1$OhuHu9HV$MGnsyEEGXt6Y6QShwL7ZM/','523312345678','admin@sheaker.com','0000-00-00','','','',0,0,0,'',0,'2015-03-19 16:27:51','127.0.0.1','2015-01-01 00:00:00');
ALTER TABLE `users` ENABLE KEYS;
UNLOCK TABLES;


LOCK TABLES `users_access` WRITE;
ALTER TABLE `users_access` DISABLE KEYS;
INSERT INTO `users_access` (`user_id`, `user_level`) VALUES 
	(1,2);
ALTER TABLE `users_access` ENABLE KEYS;
UNLOCK TABLES;


LOCK TABLES `users_payments` WRITE;
ALTER TABLE `users_payments` DISABLE KEYS;
ALTER TABLE `users_payments` ENABLE KEYS;
UNLOCK TABLES;




SET FOREIGN_KEY_CHECKS = @PREVIOUS_FOREIGN_KEY_CHECKS;


