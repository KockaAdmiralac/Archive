CREATE TABLE `users` (
    `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `username` varchar(50) NOT NULL,
    `password` varchar(64) NOT NULL,
    `description` text DEFAULT ''
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
