import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdmin1726884958235 implements MigrationInterface {
    name = 'AddAdmin1726884958235'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isAdmin" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isAdmin"`);
    }

}
