import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';

import { conversation, user } from '.';

export const conversationToUser = pgTable(
  'ConversationToUser',
  {
    conversationId: uuid('conversationId')
      .references(() => conversation.conversationId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    userId: uuid('userId')
      .references(() => user.userId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.conversationId, t.userId] }),
  })
);

export const conversationToUserRelations = relations(
  conversationToUser,
  ({ one }) => ({
    participant: one(user, {
      fields: [conversationToUser.userId],
      references: [user.userId],
    }),
    conversation: one(conversation, {
      fields: [conversationToUser.conversationId],
      references: [conversation.conversationId],
    }),
  })
);

export type ConversationToUserSelect = InferSelectModel<
  typeof conversationToUser
>;
export type ConversationToUserInsert = InferInsertModel<
  typeof conversationToUser
>;
