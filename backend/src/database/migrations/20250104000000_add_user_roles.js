/**
 * Add User Roles Migration
 * Fügt explizites role Feld (free/pro/enterprise) zur users Tabelle hinzu
 */

export async function up(knex) {
  // Check if column already exists (idempotent)
  const hasColumn = await knex.schema.hasColumn('users', 'role');
  
  if (!hasColumn) {
    // Füge role Spalte hinzu
    await knex.schema.table('users', (table) => {
      table.enum('role', ['free', 'pro', 'enterprise']).notNullable().defaultTo('free');
      table.index('role', 'idx_users_role');
    });
    
    // Migriere bestehende Daten: active/trialing subscription = pro
    await knex('users')
      .whereIn('subscription_status', ['active', 'trialing'])
      .update({ role: 'pro' });
  }
}

export async function down(knex) {
  const hasColumn = await knex.schema.hasColumn('users', 'role');
  
  if (hasColumn) {
    await knex.schema.table('users', (table) => {
      table.dropIndex('role', 'idx_users_role');
      table.dropColumn('role');
    });
  }
}

