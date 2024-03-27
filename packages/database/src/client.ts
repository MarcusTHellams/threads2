import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

import * as schema from './schema';

const { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_USER } =
  process.env;

export const client = new Client({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  ssl: false,
});

export const db = drizzle(client, { schema });