import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/infra/database/drizzle/schemas/*',
  out: './src/infra/database/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/titickets',
  },
  verbose: true,
  strict: true,
});
