#
# SQL Export
# Created by Querious (962)
# Created: March 14, 2015 at 2:50:36 PM CST
# Encoding: Unicode (UTF-8)
#


DROP TABLE IF EXISTS `users_photo`;
DROP TABLE IF EXISTS `users_payments`;
DROP TABLE IF EXISTS `users_access`;
DROP TABLE IF EXISTS `users`;


CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `custom_id` int(11) unsigned DEFAULT NULL,
  `first_name` varchar(255) NOT NULL DEFAULT '',
  `last_name` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL,
  `mail` varchar(255) NOT NULL DEFAULT '',
  `birthdate` date NOT NULL,
  `address_street_1` varchar(255) NOT NULL DEFAULT '',
  `address_street_2` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `zip` int(11) unsigned NOT NULL,
  `gender` tinyint(1) unsigned NOT NULL,
  `sponsor_id` int(11) DEFAULT NULL,
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
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `users_payments` (
  `user_id` int(11) unsigned NOT NULL,
  `days` smallint(5) unsigned DEFAULT NULL,
  `start_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `comment` varchar(255) NOT NULL DEFAULT '',
  `price` smallint(5) unsigned DEFAULT NULL,
  `method` tinyint(3) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `users_photo` (
  `user_id` int(11) unsigned NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




SET @PREVIOUS_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;


LOCK TABLES `users` WRITE;
ALTER TABLE `users` DISABLE KEYS;
INSERT INTO `users` (`id`, `custom_id`, `first_name`, `last_name`, `password`, `mail`, `birthdate`, `address_street_1`, `address_street_2`, `city`, `zip`, `gender`, `sponsor_id`, `comment`, `failed_logins`, `last_seen`, `last_ip`, `created_at`) VALUES 
	(1,0,'Gym4devs','Gym4devs','$1$OhuHu9HV$MGnsyEEGXt6Y6QShwL7ZM/','admin@sheaker.com','1970-01-01','calle egipcios, 360','appt 302','Zapopan',45160,0,0,'',0,'2015-03-14 14:03:43','http://gym4devs.sheaker.dev:3000/','2015-01-02 18:44:32');
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


LOCK TABLES `users_photo` WRITE;
ALTER TABLE `users_photo` DISABLE KEYS;
ALTER TABLE `users_photo` ENABLE KEYS;
UNLOCK TABLES;




SET FOREIGN_KEY_CHECKS = @PREVIOUS_FOREIGN_KEY_CHECKS;


