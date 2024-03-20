import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { like, reply } from '.';

export const post = pgTable('Post', {
  postId: uuid('postId').defaultRandom().primaryKey(),
  text: text('text').notNull(),
  image: text('image'),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', {
    mode: 'date',
    withTimezone: true,
  }).notNull(),
});

export const postRelations = relations(post, ({ many }) => ({
  likes: many(like),
  replies: many(reply),
}));

export type PostSelect = InferSelectModel<typeof post>;
export type PostInsert = InferInsertModel<typeof post>;
