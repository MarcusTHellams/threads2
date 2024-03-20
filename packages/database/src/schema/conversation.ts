import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { conversationToUser, message } from '.';

export const conversation = pgTable('Conversation', {
  conversationId: uuid('conversationId').defaultRandom().primaryKey(),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', {
    mode: 'date',
    withTimezone: true,
  }).notNull(),
});

export const conversationRelations = relations(conversation, ({ many }) => ({
  participants: many(conversationToUser),
  messages: many(message),
}));

export type ConversationSelect = InferSelectModel<typeof conversation>;
export type ConversationInsert = InferInsertModel<typeof conversation>;
