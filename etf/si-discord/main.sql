CREATE TABLE `students` (
    `index` INT(11) NOT NULL,
    `year` INT(11) NOT NULL,
    `first_name` VARCHAR(255),
    `last_name` VARCHAR(255),
    `discord_id` BIGINT(64) UNSIGNED,
    PRIMARY KEY(`index`, `year`),
    UNIQUE KEY `discord` (`discord_id`)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE `phone_numbers` (
    `number` BIGINT(32) NOT NULL PRIMARY KEY,
    `index` INT(11) NOT NULL,
    `year` INT(11) NOT NULL,
    CONSTRAINT `fk_phones_people` FOREIGN KEY (`index`, `year`) REFERENCES `students` (`index`, `year`)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE `roles` (
    `role_id` BIGINT(32) NOT NULL,
    `index` INT(11) NOT NULL,
    `year` INT(11) NOT NULL,
    CONSTRAINT `fk_roles_people` FOREIGN KEY (`index`, `year`) REFERENCES `students` (`index`, `year`),
    PRIMARY KEY(`role_id`, `index`, `year`)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
