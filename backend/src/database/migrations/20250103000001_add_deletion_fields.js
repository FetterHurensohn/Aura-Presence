/**
 * Migration: Add deletion_scheduled_at field to users table
 * Für GDPR-konforme Account-Löschung mit Grace-Period
 */

export async function up(knex) {
  await knex.schema.table('users', (table) => {
    table.bigInteger('deletion_scheduled_at').nullable();
    
    // Index für Cron-Job Performance
    table.index('deletion_scheduled_at', 'idx_users_deletion_scheduled_at');
  });
}

export async function down(knex) {
  await knex.schema.table('users', (table) => {
    table.dropIndex('deletion_scheduled_at', 'idx_users_deletion_scheduled_at');
    table.dropColumn('deletion_scheduled_at');
  });
}

