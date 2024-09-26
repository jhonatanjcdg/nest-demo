import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPassword1726760436655 implements MigrationInterface {
    name = 'AddPassword1726760436655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

}
