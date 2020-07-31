import {MigrationInterface, QueryRunner, Table} from "typeorm";

export default class CreateTableCategory1595536814844 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: "categories",
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

        await queryRunner.dropTable("categories");
    }

}
