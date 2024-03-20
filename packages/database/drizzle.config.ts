import 'dotenv/config';

import { defineConfig } from 'drizzle-kit';
import { join } from 'node:path';

const { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_USER } =
  process.env;

export default defineConfig({
  schema: './src/schema/*',
  driver: 'pg',
  out: join(__dirname, './src/migrations'),
  dbCredentials: {
    host: DATABASE_HOST!,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME!,
    ssl: true,
  },
  verbose: true,
  strict: true,
});
