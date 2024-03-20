import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import {
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { post, user } from '.';

export const like = pgTable(
  'Like',
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

export const likeRelations = relations(like, ({ one }) => ({
  post: one(post, { fields: [like.postId], references: [post.postId] }),
  user: one(user, { fields: [like.userId], references: [user.userId] }),
}));

export type LikeSelect = InferSelectModel<typeof like>;
export type LikeInsert = InferInsertModel<typeof like>;
