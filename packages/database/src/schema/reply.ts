import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { post, user } from '.';

export const reply = pgTable(
  'Reply',
  {
    postId: uuid('postId')
      .notNull()
      .references(() => post.postId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    userId: uuid('userId')
      .notNull()
      .references(() => user.userId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    text: text('text').notNull(),
    createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.postId, t.userId] }),
  })
);

export const replyRelations = relations(reply, ({ one }) => ({
  post: one(post, { fields: [reply.postId], references: [post.postId] }),
  postedBy: one(user, { fields: [reply.userId], references: [user.userId] }),
}));

export type ReplySelect = InferSelectModel<typeof reply>;
export type ReplyInsert = InferInsertModel<typeof reply>;
