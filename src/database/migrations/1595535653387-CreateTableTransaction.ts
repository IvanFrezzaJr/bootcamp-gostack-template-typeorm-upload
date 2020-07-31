import {MigrationInterface, QueryRunner, Table, Timestamp} from "typeorm";


export default class CreateTableTransaction1595535653387 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.query("CREATE EXTENSION IF NOT EXISTS pgcrypto;");

        await queryRunner.createTable(
            new Table({
                name: "transactions",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        generationStrategy: "uuid",
                        default: "gen_random_uuid()",
                        isUnique: true
                    },
                    {
                        name: "title",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "type",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "value",
                        type: "decimal",
                        isNullable: false
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()"
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.dropTable("transactions");

        await queryRunner.query("DROP EXTENSION pgcrypto;");
    }

}
