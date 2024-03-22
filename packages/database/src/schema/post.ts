import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

import { like, reply, user } from '.';

export const post = pgTable('Post', {
  postId: uuid('postId').defaultRandom().primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.userId, {
      onDelete: 'cascade',
      onUpdate: 'no action',
    }),
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

export const postRelations = relations(post, ({ many, one }) => ({
  likes: many(like),
  replies: many(reply),
  postedBy: one(user, { fields: [post.userId], references: [user.userId] }),
}));

export type PostSelect = InferSelectModel<typeof post>;
export type PostInsert = InferInsertModel<typeof post>;
