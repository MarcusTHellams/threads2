import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';

import { user } from '.';

export const follow = pgTable(
  'Follow',
  {
    followerId: uuid('followerId')
      .notNull()
      .references(() => user.userId),
    followeeId: uuid('followeeId')
      .notNull()
      .references(() => user.userId),
    createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
  },

  (t) => ({
    pk: primaryKey({ columns: [t.followerId, t.followeeId] }),
  })
);

export const followRelations = relations(follow, ({ one }) => ({
  follower: one(user, {
    fields: [follow.followerId],
    references: [user.userId],
    relationName: 'follow',
  }),
  followee: one(user, {
    fields: [follow.followeeId],
    references: [user.userId],
    relationName: 'followers',
  }),
}));

export type FollowSelect = InferSelectModel<typeof follow>;
export type FollowInsert = InferInsertModel<typeof follow>;
