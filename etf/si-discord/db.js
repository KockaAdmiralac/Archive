const mysql = require('mysql2/promise'),
      {db} = require('./config.json');

class Database {
    constructor() {
        this.db = mysql.createPool(db);
    }
    close() {
        return this.db.end();
    }
    async getStudent(year, index) {
        return (await this.db.execute(
            'SELECT `index`, `year`, CAST(`discord_id` AS VARCHAR(255)) AS `discord_id`, `last_name`, `first_name` FROM `students` WHERE `year` = ? AND `index` = ?',
            [year, index]
        ))[0][0];
    }
    async getStudentByDiscordID(discordID) {
        return (await this.db.execute(
            'SELECT `index`, `year`, CAST(`discord_id` AS VARCHAR(255)) AS `discord_id`, `last_name`, `first_name` FROM `students` WHERE CAST(`discord_id` AS VARCHAR(255)) = ?',
            [discordID]
        ))[0][0];
    }
    async getStudentByName(firstName, lastName) {
        return (await this.db.execute(
            'SELECT `index`, `year`, CAST(`discord_id` AS VARCHAR(255)) AS `discord_id`, `last_name`, `first_name` FROM `students` WHERE `first_name` = ? AND `last_name` = ?',
            [firstName, lastName]
        ))[0][0];
    }
    async getAllStudents() {
        return (await this.db.execute(
            'SELECT `index`, `year`, CAST(`discord_id` AS VARCHAR(255)) AS `discord_id`, `last_name`, `first_name` FROM `students`'
        ))[0];
    }
    async addStudent(year, index, lastName, firstName, discordID) {
        await this.db.execute(
            'INSERT INTO `students` (`year`, `index`, `last_name`, `first_name`, `discord_id`) VALUES (?, ?, ?, ?, ?)',
            [year, index, lastName, firstName, discordID]
        );
    }
    async addPhoneNumber(year, index, phone) {
        await this.db.execute(
            'INSERT INTO `phone_numbers` (`number`, `index`, `year`) VALUES (?, ?, ?)',
            [phone, index, year]
        );
    }
    async addPhoneNumberName(firstName, lastName, phone) {
        await this.db.execute(
            'INSERT INTO `phone_numbers` (`index`, `year`, `number`) SELECT `index`, `year`, ? FROM `students` WHERE `first_name` = ? AND `last_name` = ?',
            [phone, firstName, lastName]
        );
    }
}

module.exports = Database;
