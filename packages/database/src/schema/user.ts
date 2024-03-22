import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { conversationToUser, follow, like, message, post, reply } from '.';

export const user = pgTable('User', {
  userId: uuid('userId').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 100 }).notNull(),
  profilePic: text('profilePic'),
  bio: text('bio'),
  isFrozen: boolean('isFrozen').default(false),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', {
    mode: 'date',
    withTimezone: true,
  }).notNull(),
});

export const usersRelations = relations(user, ({ many }) => ({
  follows: many(follow, { relationName: 'follow' }),
  followers: many(follow, { relationName: 'followers' }),
  likes: many(like),
  replies: many(reply),
  conversations: many(conversationToUser),
  messages: many(message),
  posts: many(post),
}));

export type UserSelect = InferSelectModel<typeof user>;
export type UserInsert = InferInsertModel<typeof user>;
