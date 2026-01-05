/**
 * Migration: Add Profile Fields to Users
 * Fügt name, company und country zur users Tabelle hinzu
 */

export async function up(knex) {
  await knex.schema.table('users', (table) => {
    table.string('name', 255);
    table.string('company', 255);
    table.string('country', 100);
  });
}

export async function down(knex) {
  await knex.schema.table('users', (table) => {
    table.dropColumn('name');
    table.dropColumn('company');
    table.dropColumn('country');
  });
}

