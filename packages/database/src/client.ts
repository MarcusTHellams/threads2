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

db.insert(schema.post)
  .values({
    text: 'New post',
    updatedAt: new Date(),
    userId: '0d1c34e0-b62f-437c-bfa5-21d51580ec97',
  })
  .returning()
  .then((resp) => console.log(resp));
