import { pgEnum } from 'drizzle-orm/pg-core';

export const paymentMethodEnum = pgEnum('payment_method_enum', [
  'PIX',
  'DEBIT_CARD',
  'CREDIT_CARD',
  'BOLETO',
]);
export const orderStatusEnum = pgEnum('order_status_enum', [
  'PENDING',
  'PAID',
  'CANCELLED',
  'REFUNDED',
]);
export const eventStatusEnum = pgEnum('event_status_enum', [
  'DRAFT',
  'PUBLISHED',
  'SOLD_OUT',
  'FINISHED',
]);
export const organizerRoleEnum = pgEnum('organizer_role_enum', [
  'OWNER',
  'ADMIN',
]);
