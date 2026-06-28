import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFeatureCard1782600000000 implements MigrationInterface {
    name = 'AddFeatureCard1782600000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`feature_card\` (\`id\` int NOT NULL AUTO_INCREMENT, \`titleEn\` varchar(255) NOT NULL DEFAULT '', \`titleKa\` varchar(255) NOT NULL DEFAULT '', \`icon\` varchar(255) NOT NULL DEFAULT 'star', \`itemsEn\` json NOT NULL DEFAULT '[]', \`itemsKa\` json NOT NULL DEFAULT '[]', \`isVisible\` tinyint NOT NULL DEFAULT 1, \`order\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`feature_card\``);
    }
}
