import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tariffs", (table) => {
    table.increments("id").primary();
    table.date("date").notNullable();
    table.string("warehouse_name").notNullable();
    table.string("geo_name").notNullable();
    table.string("box_delivery_base").notNullable();
    table.string("box_delivery_coef_expr").notNullable();
    table.string("box_delivery_liter").notNullable();
    table.string("box_delivery_marketplace_base").notNullable();
    table.string("box_delivery_marketplace_coef_expr").notNullable();
    table.string("box_delivery_marketplace_liter").notNullable();
    table.string("box_storage_base").notNullable();
    table.string("box_storage_coef_expr").notNullable();
    table.string("box_storage_liter").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.unique(["date", "warehouse_name"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("tariffs");
}