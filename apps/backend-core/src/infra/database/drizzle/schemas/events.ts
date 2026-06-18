import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  numeric,
  integer,
  index,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { eventStatusEnum } from './enums';
import { organizers } from './base';

export const categories = pgTable(
  'Category',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [index('idx_category_slug').on(table.slug)],
);

export const venues = pgTable('Venue', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 50 }).notNull(),
  cep: varchar('cep', { length: 20 }).notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const events = pgTable(
  'Event',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'restrict' }),
    venueId: uuid('venue_id')
      .notNull()
      .references(() => venues.id, { onDelete: 'restrict' }),
    organizerId: uuid('organizer_id')
      .notNull()
      .references(() => organizers.id, { onDelete: 'cascade' }),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    bannerUrl: text('banner_url'),
    startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
    endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
    status: eventStatusEnum('status').default('DRAFT').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_event_slug').on(table.slug),
    index('idx_event_status_starts_at').on(table.status, table.startsAt),
    index('idx_event_category_id').on(table.categoryId),
    index('idx_event_venue_id').on(table.venueId),
    index('idx_event_organizer_id').on(table.organizerId),
    check('chk_event_dates', sql`${table.endsAt} > ${table.startsAt}`),
  ],
);

export const eventArtists = pgTable('Event_artist', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  imageUrl: text('image_url'),
});

export const ticketTypes = pgTable(
  'Ticket_type',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    totalQuantity: integer('total_quantity').notNull(),
    soldQuantity: integer('sold_quantity').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_ticket_type_event_id').on(table.eventId),
    check('chk_price_positive', sql`${table.price} >= 0`),
    check(
      'chk_quantities',
      sql`${table.totalQuantity} >= 0 AND ${table.soldQuantity} >= 0`,
    ),
    check(
      'chk_sold_limit',
      sql`${table.soldQuantity} <= ${table.totalQuantity}`,
    ),
  ],
);
