import {
  pgTable,
  uuid,
  integer,
  numeric,
  timestamp,
  index,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { orderStatusEnum, paymentMethodEnum } from './enums';
import { users } from './base';
import { ticketTypes } from './events';

export const orders = pgTable(
  'Order',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    status: orderStatusEnum('status').default('PENDING').notNull(),
    paymentMethod: paymentMethodEnum('payment_method').notNull(),
    totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_order_user_id').on(table.userId),
    check('chk_total_amount_positive', sql`${table.totalAmount} >= 0`),
  ],
);

export const orderItems = pgTable(
  'Order_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    ticketTypeId: uuid('ticket_type_id')
      .notNull()
      .references(() => ticketTypes.id, { onDelete: 'restrict' }),
    quantity: integer('quantity').notNull(),
    unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  },
  (table) => [
    index('idx_order_items_order_id').on(table.orderId),
    index('idx_order_items_ticket_type_id').on(table.ticketTypeId),
    check('chk_quantity_positive', sql`${table.quantity} > 0`),
    check('chk_unit_price_positive', sql`${table.unitPrice} >= 0`),
  ],
);
