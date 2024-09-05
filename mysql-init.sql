/*
MySQL Backup
Database: tour_management
Backup Time: 2024-09-05 23:19:55
*/

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `tour_management`.`booking_details`;
DROP TABLE IF EXISTS `tour_management`.`bookings`;
DROP TABLE IF EXISTS `tour_management`.`locations`;
DROP TABLE IF EXISTS `tour_management`.`payments`;
DROP TABLE IF EXISTS `tour_management`.`reviews`;
DROP TABLE IF EXISTS `tour_management`.`services`;
DROP TABLE IF EXISTS `tour_management`.`tour_services`;
DROP TABLE IF EXISTS `tour_management`.`tours`;
DROP TABLE IF EXISTS `tour_management`.`users`;
CREATE TABLE `booking_details` (
  `booking_detail_id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `tour_id` int NOT NULL,
  `user_id` int NOT NULL,
  `number_of_people` int NOT NULL,
  `notes` text,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`booking_detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `bookings` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `tour_id` int NOT NULL,
  `booking_date` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `payment_id` int NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`booking_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `locations` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `location_name` varchar(255) NOT NULL,
  `description` text,
  `address` varchar(255) DEFAULT NULL,
  `coordinates` varchar(100) DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` datetime NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(50) DEFAULT NULL,
  `transaction_status` varchar(50) DEFAULT NULL,
  `booking_id` int DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `tour_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`review_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `services` (
  `service_id` int NOT NULL AUTO_INCREMENT,
  `service_name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `service_category` varchar(100) DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `tour_services` (
  `tour_id` int NOT NULL,
  `service_id` int NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`tour_id`,`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `tours` (
  `tour_id` int NOT NULL AUTO_INCREMENT,
  `tour_name` varchar(255) NOT NULL,
  `description` text,
  `location_id` int NOT NULL,
  `user_id` int NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `availability` int DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`tour_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(255) NOT NULL,
  `money` int NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
BEGIN;
LOCK TABLES `tour_management`.`booking_details` WRITE;
DELETE FROM `tour_management`.`booking_details`;
INSERT INTO `tour_management`.`booking_details` (`booking_detail_id`,`booking_id`,`tour_id`,`user_id`,`number_of_people`,`notes`,`createdAt`,`updatedAt`) VALUES (1, 1, 1, 1, 2, 'Family trip', '2024-09-04 13:38:49.206826', '2024-09-04 13:38:49.206826'),(2, 2, 2, 1, 4, 'Company retreat', '2024-09-04 13:38:49.206826', '2024-09-04 13:38:49.206826'),(3, 3, 3, 1, 1, 'Solo traveler', '2024-09-04 13:38:49.206826', '2024-09-04 13:38:49.206826'),(4, 4, 1, 1, 3, 'Friends reunion', '2024-09-04 13:38:49.206826', '2024-09-04 13:38:49.206826'),(5, 5, 2, 1, 5, 'Team building', '2024-09-04 13:38:49.206826', '2024-09-04 13:38:49.206826');
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `tour_management`.`bookings` WRITE;
DELETE FROM `tour_management`.`bookings`;
INSERT INTO `tour_management`.`bookings` (`booking_id`,`user_id`,`tour_id`,`booking_date`,`status`,`payment_id`,`createdAt`,`updatedAt`) VALUES (1, 1, 1, '2024-09-01 10:00:00', 'confirmed', 1, '2024-09-04 13:38:49.192905', '2024-09-04 13:38:49.192905'),(2, 1, 2, '2024-09-02 12:00:00', 'pending', 2, '2024-09-04 13:38:49.192905', '2024-09-04 13:41:50.321685'),(3, 1, 3, '2024-09-03 14:00:00', 'cancelled', 3, '2024-09-04 13:38:49.192905', '2024-09-04 13:41:51.367388'),(4, 1, 1, '2024-09-04 16:00:00', 'confirmed', 4, '2024-09-04 13:38:49.192905', '2024-09-04 13:41:52.210389'),(5, 1, 2, '2024-09-05 18:00:00', 'confirmed', 5, '2024-09-04 13:38:49.192905', '2024-09-04 13:41:53.776421');
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `tour_management`.`locations` WRITE;
DELETE FROM `tour_management`.`locations`;
INSERT INTO `tour_management`.`locations` (`location_id`,`location_name`,`description`,`address`,`coordinates`,`createdAt`,`updatedAt`) VALUES (1, 'Ha Long Bay', 'Famous for its emerald waters and thousands of towering limestone islands topped with rainforests.', 'Quang Ninh, Vietnam', '20.9101Â° N, 107.1839Â° E', '2024-08-29 16:53:08.013573', '2024-08-29 16:53:08.013573'),(2, 'Sapa', 'Known for its terraced rice fields and the ethnic minority communities.', 'Lao Cai, Vietnam', '22.3361Â° N, 103.8436Â° E', '2024-08-29 16:53:08.013573', '2024-08-29 16:53:08.013573'),(3, 'Hue', 'The ancient capital city known for its historic monuments.', 'Thua Thien Hue, Vietnam', '16.4637Â° N, 107.5909Â° E', '2024-08-29 16:53:08.013573', '2024-08-29 16:53:08.013573'),(4, 'Ha Giang', NULL, NULL, NULL, '2024-09-01 00:27:56.388815', '2024-09-01 00:27:56.388815'),(5, 'Ha Giang', NULL, NULL, NULL, '2024-09-01 00:31:44.569531', '2024-09-01 00:31:44.569531'),(6, 'Ha Giang', NULL, NULL, NULL, '2024-09-01 00:34:09.087329', '2024-09-01 00:34:09.087329'),(7, 'Ha Giang', NULL, NULL, NULL, '2024-09-01 00:34:56.575664', '2024-09-01 00:34:56.575664'),(8, 'Ha Giang', NULL, NULL, NULL, '2024-09-01 00:35:56.686513', '2024-09-01 00:35:56.686513'),(9, 'Ha Giang', NULL, NULL, NULL, '2024-09-01 00:39:32.279017', '2024-09-01 00:39:32.279017'),(10, 'Ha Giang', NULL, NULL, NULL, '2024-09-01 00:42:30.514105', '2024-09-01 00:42:30.514105'),(11, 'Ha Giang', NULL, NULL, NULL, '2024-09-01 00:43:50.109237', '2024-09-01 00:43:50.109237'),(12, 'Ha Giang', NULL, NULL, NULL, '2024-09-01 00:50:37.707401', '2024-09-01 00:50:37.707401'),(13, 'Ha Giang', 'test description', 'Ban Meo Vac', '', '2024-09-01 00:51:32.000693', '2024-09-01 10:03:56.000000');
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `tour_management`.`payments` WRITE;
DELETE FROM `tour_management`.`payments`;
INSERT INTO `tour_management`.`payments` (`payment_id`,`amount`,`payment_date`,`payment_method`,`status`,`transaction_id`,`transaction_status`,`booking_id`,`createdAt`,`updatedAt`) VALUES (1, 500.00, '2024-09-01 10:30:00', 'credit_card', 'completed', 'TXN001', 'success', 1, '2024-09-04 13:38:49.198000', '2024-09-04 13:38:49.198000'),(2, 300.00, '2024-09-02 12:30:00', 'paypal', 'completed', 'TXN002', 'success', 2, '2024-09-04 13:38:49.198000', '2024-09-04 13:38:49.198000'),(3, 0.00, '2024-09-03 14:30:00', 'credit_card', 'refunded', 'TXN003', 'refunded', 3, '2024-09-04 13:38:49.198000', '2024-09-04 13:38:49.198000'),(4, 700.00, '2024-09-04 16:30:00', 'credit_card', 'completed', 'TXN004', 'success', 4, '2024-09-04 13:38:49.198000', '2024-09-04 13:38:49.198000'),(5, 200.00, '2024-09-05 18:30:00', 'bank_transfer', 'pending', 'TXN005', 'pending', 5, '2024-09-04 13:38:49.198000', '2024-09-04 13:38:49.198000');
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `tour_management`.`reviews` WRITE;
DELETE FROM `tour_management`.`reviews`;
INSERT INTO `tour_management`.`reviews` (`review_id`,`user_id`,`tour_id`,`rating`,`comment`,`createdAt`,`updatedAt`) VALUES (1, 1, 1, 5, 'Amazing experience! The views were breathtaking.', '2024-08-29 16:53:08.032126', '2024-08-29 16:53:08.032126'),(2, 1, 2, 4, 'Great trek, but the weather was a bit challenging.', '2024-08-29 16:53:08.032126', '2024-08-29 16:53:08.032126'),(3, 1, 3, 5, 'Loved the historical sites, very informative tour.', '2024-08-29 16:53:08.032126', '2024-08-29 16:53:08.032126');
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `tour_management`.`services` WRITE;
DELETE FROM `tour_management`.`services`;
INSERT INTO `tour_management`.`services` (`service_id`,`service_name`,`description`,`price`,`service_category`,`createdAt`,`updatedAt`) VALUES (1, 'Airport Pickup', 'Convenient airport pickup service.', 50.00, 'Transportation', '2024-08-29 16:53:08.022781', '2024-08-29 16:53:08.022781'),(2, 'Guide Service', 'Professional guide service for the entire tour.', 100.00, 'Tour Guide', '2024-08-29 16:53:08.022781', '2024-08-29 16:53:08.022781'),(3, 'Meal Plan', 'Includes breakfast, lunch, and dinner.', 30.00, 'Food', '2024-08-29 16:53:08.022781', '2024-08-29 16:53:08.022781');
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `tour_management`.`tour_services` WRITE;
DELETE FROM `tour_management`.`tour_services`;
INSERT INTO `tour_management`.`tour_services` (`tour_id`,`service_id`,`createdAt`,`updatedAt`) VALUES (1, 1, '2024-08-29 16:53:08.028032', '2024-08-29 16:53:08.028032'),(1, 2, '2024-08-29 16:53:08.028032', '2024-08-29 16:53:08.028032'),(2, 2, '2024-08-29 16:53:08.028032', '2024-08-29 16:53:08.028032'),(2, 3, '2024-08-29 16:53:08.028032', '2024-08-29 16:53:08.028032'),(3, 1, '2024-08-29 16:53:08.028032', '2024-08-29 16:53:08.028032');
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `tour_management`.`tours` WRITE;
DELETE FROM `tour_management`.`tours`;
INSERT INTO `tour_management`.`tours` (`tour_id`,`tour_name`,`description`,`location_id`,`user_id`,`price`,`start_date`,`end_date`,`availability`,`createdAt`,`updatedAt`) VALUES (1, 'Ha Long Bay Cruise', 'A 3-day cruise exploring the wonders of Ha Long Bay.', 1, 1, 200.00, '2024-09-01', '2024-09-03', 30, '2024-09-01 00:36:42.461893', '2024-09-01 00:36:42.461893'),(2, 'Sapa Trekking', 'A 2-day trekking tour in Sapa, experiencing the culture of ethnic minorities.', 2, 1, 150.00, '2024-09-05', '2024-09-06', 15, '2024-09-01 00:36:42.461893', '2024-09-04 14:50:08.000000'),(3, 'Hue Heritage Tour', 'A 1-day tour exploring the historic sites of Hue.', 3, 1, 100.00, '2024-09-10', '2024-09-10', 25, '2024-09-01 00:36:42.461893', '2024-09-01 00:36:42.461893');
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `tour_management`.`users` WRITE;
DELETE FROM `tour_management`.`users`;
INSERT INTO `tour_management`.`users` (`user_id`,`password`,`money`,`last_login`,`createdAt`,`updatedAt`,`username`,`email`,`role`) VALUES (1, '$2b$12$zgMfdFEJxw9g6UmAY8J4yO3WvDpPFVr29DT/Dace6DcQMU1U8UOhC', 4999250, '2024-09-05 16:16:07', '2024-08-29 17:02:22.393813', '2024-09-05 16:16:06.000000', 'iamkhanhh', 'khan@gmail.com', 'admin'),(2, '$2b$12$yKS4tL68Yk0hlirlIHW.eOj8LCNse4vz8R/cOvtr0v3liMgpnBQxq', 500000, '2024-09-01 23:33:39', '2024-08-29 17:02:42.031624', '2024-09-05 16:18:54.952416', 'provider', 'provider@gmail.com', 'provider'),(3, '$2b$12$e7BQPJm40Smp.1ovuILqKue.s7A391Yw1OKk3BDY3LydifSFQAA6y', 500000, '2024-09-05 15:56:45', '2024-09-05 15:56:45.250589', '2024-09-05 16:18:59.328670', 'test123', 'test123@gmail.com', 'guest'),(4, '$2b$12$EdlZn5FRzOBCIdfGA4cKpOmZUXjwvA.cSw4PbdLt60KiocK2LBniS', 500000, '2024-09-05 16:17:47', '2024-09-05 16:15:58.075940', '2024-09-05 16:19:04.540790', 'admin', 'admin@gmail.com', 'admin');
UNLOCK TABLES;
COMMIT;
