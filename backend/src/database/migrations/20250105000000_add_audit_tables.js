/**
 * Add Audit & Analytics Tables Migration
 * Umfassende Tracking-Infrastruktur für Production
 */

export async function up(knex) {
  // User Activity Log
  await knex.schema.createTable('user_activity_log', (table) => {
    table.bigIncrements('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('action', 100).notNullable(); // login, logout, analysis_start, etc.
    table.string('ip_address', 45);
    table.text('user_agent');
    table.jsonb('metadata'); // additional context
    table.bigInteger('timestamp').notNullable();
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.index('user_id', 'idx_activity_user_id');
    table.index('action', 'idx_activity_action');
    table.index('timestamp', 'idx_activity_timestamp');
  });
  
  // API Request Tracking
  await knex.schema.createTable('api_requests', (table) => {
    table.bigIncrements('id').primary();
    table.integer('user_id').unsigned();
    table.string('method', 10).notNullable(); // GET, POST, etc.
    table.string('endpoint', 255).notNullable();
    table.integer('status_code').notNullable();
    table.integer('response_time_ms');
    table.string('ip_address', 45);
    table.bigInteger('timestamp').notNullable();
    
    table.foreign('user_id').references('users.id').onDelete('SET NULL');
    table.index('user_id', 'idx_api_requests_user_id');
    table.index('endpoint', 'idx_api_requests_endpoint');
    table.index('timestamp', 'idx_api_requests_timestamp');
    table.index('status_code', 'idx_api_requests_status_code');
  });
  
  // Feature Usage Tracking
  await knex.schema.createTable('feature_usage', (table) => {
    table.bigIncrements('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('feature_name', 100).notNullable(); // AI_FEEDBACK, EXPORT_DATA, etc.
    table.integer('usage_count').defaultTo(1);
    table.bigInteger('timestamp').notNullable();
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.index('user_id', 'idx_feature_usage_user_id');
    table.index('feature_name', 'idx_feature_usage_feature_name');
    table.index('timestamp', 'idx_feature_usage_timestamp');
  });
  
  // Error Logs
  await knex.schema.createTable('error_logs', (table) => {
    table.bigIncrements('id').primary();
    table.integer('user_id').unsigned();
    table.string('error_type', 100).notNullable(); // AuthError, StripeError, AIError, etc.
    table.text('error_message').notNullable();
    table.text('stack_trace');
    table.string('endpoint', 255);
    table.jsonb('context'); // request data, user state, etc.
    table.bigInteger('timestamp').notNullable();
    
    table.foreign('user_id').references('users.id').onDelete('SET NULL');
    table.index('user_id', 'idx_error_logs_user_id');
    table.index('error_type', 'idx_error_logs_error_type');
    table.index('timestamp', 'idx_error_logs_timestamp');
  });
  
  // Performance Metrics
  await knex.schema.createTable('performance_metrics', (table) => {
    table.bigIncrements('id').primary();
    table.string('metric_name', 100).notNullable(); // api_latency, db_query_time, etc.
    table.float('value').notNullable();
    table.string('unit', 20).notNullable(); // ms, seconds, count, etc.
    table.jsonb('metadata'); // additional context
    table.bigInteger('timestamp').notNullable();
    
    table.index('metric_name', 'idx_performance_metrics_metric_name');
    table.index('timestamp', 'idx_performance_metrics_timestamp');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('performance_metrics');
  await knex.schema.dropTableIfExists('error_logs');
  await knex.schema.dropTableIfExists('feature_usage');
  await knex.schema.dropTableIfExists('api_requests');
  await knex.schema.dropTableIfExists('user_activity_log');
}



