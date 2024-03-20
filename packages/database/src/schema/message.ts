import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { conversation, user } from '.';

export const message = pgTable('Message', {
  messageId: uuid('messageId').defaultRandom().primaryKey(),
  userId: uuid('userId')
    .references(() => user.userId, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  conversationId: uuid('conversationId')
    .references(() => conversation.conversationId, {
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
});

export const messageRelations = relations(message, ({ one }) => ({
  sender: one(user, { fields: [message.userId], references: [user.userId] }),
  conversation: one(conversation, {
    fields: [message.conversationId],
    references: [conversation.conversationId],
  }),
}));

export type MessageSelect = InferSelectModel<typeof message>;
export type MessageInsert = InferInsertModel<typeof message>;
