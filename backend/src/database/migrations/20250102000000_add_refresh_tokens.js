/**
 * Migration: Add refresh_tokens table
 * 
 * Diese Tabelle speichert Refresh-Tokens für JWT-Token-Rotation
 */

export async function up(knex) {
  await knex.schema.createTable('refresh_tokens', table => {
    table.increments('id').primary();
    table.integer('user_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE'); // Delete tokens when user is deleted
    table.string('token', 512).notNullable().unique();
    table.bigInteger('expires_at').notNullable();
    table.boolean('revoked').defaultTo(false);
    table.bigInteger('created_at').notNullable();
    table.string('user_agent', 512); // Optional: Track device/browser
    table.string('ip_address', 45); // Optional: Track IP (IPv6 compatible)
    
    // Indexes for performance
    table.index(['user_id', 'revoked']);
    table.index('expires_at');
    table.index('token');
  });
  
  console.log('✓ Created refresh_tokens table');
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('refresh_tokens');
  console.log('✓ Dropped refresh_tokens table');
}





