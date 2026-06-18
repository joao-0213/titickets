import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { organizerRoleEnum } from './enums';

export const users = pgTable('User', {
  id: uuid('id').defaultRandom().primaryKey(),
  cpf: varchar('cpf', { length: 14 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  telephone: varchar('telephone', { length: 20 }),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  isActive: boolean('is_active').default(true),
});

export const organizers = pgTable('Organizer', {
  id: uuid('id').defaultRandom().primaryKey(),
  cnpj: varchar('cnpj', { length: 18 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(true),
});

export const organizerMembers = pgTable(
  'Organizer_members',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    organizerId: uuid('organizer_id')
      .notNull()
      .references(() => organizers.id, { onDelete: 'cascade' }),
    role: organizerRoleEnum('role').notNull(),
    isActive: boolean('is_active').default(true),
  },
  (table) => [primaryKey({ columns: [table.userId, table.organizerId] })],
);
