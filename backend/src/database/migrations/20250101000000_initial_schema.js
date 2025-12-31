/**
 * Initial Schema Migration
 * Erstellt: users, analysis_sessions, webhook_events Tabellen
 */

export async function up(knex) {
  // Users Tabelle
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 255).unique().notNullable();
    table.string('password_hash', 255).notNullable();
    table.string('stripe_customer_id', 255);
    table.string('subscription_status', 50).defaultTo('none');
    table.string('subscription_plan', 255);
    table.bigInteger('subscription_current_period_end');
    table.bigInteger('created_at').notNullable();
    table.bigInteger('updated_at').notNullable();
    
    table.index('email', 'idx_users_email');
    table.index('stripe_customer_id', 'idx_users_stripe_customer_id');
  });

  // Analysis Sessions Tabelle
  await knex.schema.createTable('analysis_sessions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.bigInteger('started_at').notNullable();
    table.bigInteger('ended_at');
    table.integer('total_frames').defaultTo(0);
    table.float('average_confidence');
    table.text('metadata');
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.index('user_id', 'idx_analysis_sessions_user_id');
    table.index('started_at', 'idx_analysis_sessions_started_at');
  });

  // Webhook Events Tabelle (für Idempotenz)
  await knex.schema.createTable('webhook_events', (table) => {
    table.increments('id').primary();
    table.string('event_id', 255).unique().notNullable();
    table.string('event_type', 100).notNullable();
    table.bigInteger('processed_at').notNullable();
    table.text('payload');
    table.integer('user_id').unsigned();
    
    table.foreign('user_id').references('users.id').onDelete('SET NULL');
    table.index('event_id', 'idx_webhook_events_event_id');
    table.index('event_type', 'idx_webhook_events_event_type');
    table.index('processed_at', 'idx_webhook_events_processed_at');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('webhook_events');
  await knex.schema.dropTableIfExists('analysis_sessions');
  await knex.schema.dropTableIfExists('users');
}





