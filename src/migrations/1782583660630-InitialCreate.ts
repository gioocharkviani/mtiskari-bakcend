import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialCreate1782583660630 implements MigrationInterface {
    name = 'InitialCreate1782583660630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL, \`type\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`expiresAt\` timestamp NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`photo\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filename\` varchar(255) NOT NULL, \`originalName\` varchar(255) NOT NULL, \`title\` varchar(255) NULL, \`description\` varchar(255) NULL, \`url\` varchar(255) NOT NULL, \`order\` int NOT NULL DEFAULT '0', \`isVisible\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`days\` (\`id\` int NOT NULL AUTO_INCREMENT, \`price\` int NULL, \`date\` date NOT NULL, \`isBooked\` tinyint NOT NULL DEFAULT 0, \`isBlocked\` tinyint NOT NULL DEFAULT 0, \`cottageId\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`monthId\` int NULL, UNIQUE INDEX \`IDX_a6a86f401a888f0e0936e4b17f\` (\`date\`, \`cottageId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`month\` (\`id\` int NOT NULL AUTO_INCREMENT, \`month\` int NOT NULL, \`price\` int NULL, \`year\` int NOT NULL, \`cottageId\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`email\` (\`id\` int NOT NULL AUTO_INCREMENT, \`from\` varchar(255) NOT NULL, \`subject\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`booking\` (\`id\` int NOT NULL AUTO_INCREMENT, \`reference\` varchar(255) NULL, \`guestId\` int NULL, \`cottageId\` int NULL, \`channelId\` int NULL, \`channelName\` varchar(255) NULL, \`paymentStatus\` enum ('UNPAID', 'PAID', 'PARTIALLY_PAID') NULL DEFAULT 'UNPAID', \`paymentType\` enum ('CASH', 'CARD', 'BANK_TRANSFER') NULL, \`checkInDate\` varchar(255) NOT NULL, \`checkOutDate\` varchar(255) NOT NULL, \`totalNights\` int NOT NULL, \`guestCount\` int NOT NULL, \`totalPrice\` int NOT NULL, \`createdAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`bookingStatus\` enum ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REJECTED', 'REFUNDED') NULL DEFAULT 'PENDING', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`guest\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`totalBooking\` int NULL DEFAULT '0', UNIQUE INDEX \`IDX_383cd7f0a7ad82660ea82e172d\` (\`phone\`), UNIQUE INDEX \`IDX_06f7a4d24efa523651c38fa35e\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cottage\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`maxGuests\` int NOT NULL DEFAULT '4', \`isActive\` tinyint NOT NULL DEFAULT 1, \`order\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`content\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(255) NOT NULL, \`en\` text NULL, \`ka\` text NULL, \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_5739240fe9e0a7b81d8b99cf17\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`confirmation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`channel\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`color\` varchar(255) NOT NULL DEFAULT '#6366f1', \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`app_setting\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(255) NOT NULL, \`value\` text NOT NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_0d66bfb0d9f93124a4549d21af\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`days\` ADD CONSTRAINT \`FK_f350dbd107cf7fdc67464dadfb5\` FOREIGN KEY (\`monthId\`) REFERENCES \`month\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`days\` DROP FOREIGN KEY \`FK_f350dbd107cf7fdc67464dadfb5\``);
        await queryRunner.query(`DROP INDEX \`IDX_0d66bfb0d9f93124a4549d21af\` ON \`app_setting\``);
        await queryRunner.query(`DROP TABLE \`app_setting\``);
        await queryRunner.query(`DROP TABLE \`channel\``);
        await queryRunner.query(`DROP TABLE \`confirmation\``);
        await queryRunner.query(`DROP INDEX \`IDX_5739240fe9e0a7b81d8b99cf17\` ON \`content\``);
        await queryRunner.query(`DROP TABLE \`content\``);
        await queryRunner.query(`DROP TABLE \`cottage\``);
        await queryRunner.query(`DROP INDEX \`IDX_06f7a4d24efa523651c38fa35e\` ON \`guest\``);
        await queryRunner.query(`DROP INDEX \`IDX_383cd7f0a7ad82660ea82e172d\` ON \`guest\``);
        await queryRunner.query(`DROP TABLE \`guest\``);
        await queryRunner.query(`DROP TABLE \`booking\``);
        await queryRunner.query(`DROP TABLE \`email\``);
        await queryRunner.query(`DROP TABLE \`month\``);
        await queryRunner.query(`DROP INDEX \`IDX_a6a86f401a888f0e0936e4b17f\` ON \`days\``);
        await queryRunner.query(`DROP TABLE \`days\``);
        await queryRunner.query(`DROP TABLE \`photo\``);
        await queryRunner.query(`DROP TABLE \`token\``);
    }

}
