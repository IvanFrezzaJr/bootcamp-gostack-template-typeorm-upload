import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export default class addCategoryIdToTransaction1596136894371 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "transactions",
            new TableColumn({
                name: "category_id",
                type: "uuid",
                isNullable: true
            }),
        );

        await queryRunner.createForeignKey(
            "transactions",
            new TableForeignKey({
                columnNames: ["category_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "categories",
                name: "fk_transaction_to_category_ID",
                onUpdate: "CASCADE",
                onDelete: "SET NULL"
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.dropForeignKey("transactions", "fk_transaction_to_category_ID");
        await queryRunner.dropColumn("transactions", "category_id");
    }

}
