import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { users } from './base';

export const auditLogs = pgTable(
  'Audit_log',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    entityType: varchar('entity_type', { length: 100 }).notNull(),
    entityId: uuid('entity_id').notNull(),
    action: varchar('action', { length: 50 }).notNull(),
    oldValue: jsonb('old_value'),
    newValue: jsonb('new_value'),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_audit_log_entity').on(table.entityType, table.entityId),
  ],
);
