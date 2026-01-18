import { pgSchema, serial, text, timestamp, boolean, varchar, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================
// SCHÉMA POSTGRESQL CUSTOM
// ============================================================
export const scTrapotopia = pgSchema('sc_trapotopia');

// ============================================================
// USERS
// ============================================================
export const discordUsers = scTrapotopia.table('discord_users', {
  id: serial('id').primaryKey(),
  userId: text('user_id').unique().notNull(),
  username: text('username').notNull(),
  avatar: text('avatar'),
  email: text('email'),
  role: text('role', { enum: ['MEMBER', 'EVENTS_STAFF', 'ADMIN'] }).default('MEMBER').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at'),
});
export type DiscordUser = typeof discordUsers.$inferSelect;

// ============================================================
// SESSIONS
// ============================================================
export const sessions = scTrapotopia.table('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => discordUsers.userId, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export type Session = typeof sessions.$inferSelect;

// ============================================================
// EVENTS
// ============================================================
export const events = scTrapotopia.table('events', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  description: text('description'), // Rich Text (HTML ou Markdown)
  bannerImageUrl: varchar('banner_image_url', { length: 500 }),
  isPublished: boolean('is_published').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const eventsRelations = relations(events, ({ many }) => ({
  challenges: many(challenges),
  attachments: many(eventAttachments),
}));

// ============================================================
// CHALLENGES
// ============================================================
export const challenges = scTrapotopia.table('challenges', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }), // Peut être NULL si même titre que l'event
  description: text('description'), // Détails spécifiques (règles, screenshot requis)
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  rewardText: varchar('reward_text', { length: 255 }), // Ex: "500.000 Kamas"
  category: varchar('category', { length: 50 }).default('General').notNull(),
});

export const challengesRelations = relations(challenges, ({ one }) => ({
  event: one(events, {
    fields: [challenges.eventId],
    references: [events.id],
  }),
}));

// ============================================================
// EVENT ATTACHMENTS
// ============================================================
export const eventAttachments = scTrapotopia.table('event_attachments', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  fileUrl: varchar('file_url', { length: 500 }).notNull(),
  fileName: varchar('file_name', { length: 255 }),
  fileType: varchar('file_type', { length: 50 }), // Ex: 'image/png', 'application/pdf'
});

export const eventAttachmentsRelations = relations(eventAttachments, ({ one }) => ({
  event: one(events, {
    fields: [eventAttachments.eventId],
    references: [events.id],
  }),
}));
