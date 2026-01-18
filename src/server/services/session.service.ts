import { eq } from 'drizzle-orm';
import { getDb } from '../../db';
import { discordUsers, sessions, type DiscordUser } from '../../db/schema';
import { log } from '../../logger/logger';
import type { DiscordUser as DiscordApiUser, DiscordGuildMember } from './discord.service';

// ============================================================
// Types
// ============================================================
export interface SessionData {
  user: DiscordUser;
}

// ============================================================
// Session Management
// ============================================================
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

/**
 * Génère un ID de session sécurisé
 */
function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Crée ou met à jour un utilisateur dans la base de données
 */
export async function upsertUser(discordUser: DiscordApiUser, guildMember?: DiscordGuildMember): Promise<DiscordUser> {
  const db = getDb();

  log.auth.info(`Upsert utilisateur: ${discordUser.username} (${discordUser.id})`);

  // Chercher l'utilisateur existant
  const existing = await db
    .select()
    .from(discordUsers)
    .where(eq(discordUsers.userId, discordUser.id))
    .limit(1);

  const now = new Date();

  if (existing.length > 0) {
    // Mise à jour de l'utilisateur existant
    const [updated] = await db
      .update(discordUsers)
      .set({
        username: discordUser.username,
        globalName: discordUser.global_name ?? null,
        nickname: guildMember?.nick ?? null,
        avatar: discordUser.avatar,
        email: discordUser.email ?? null,
        updatedAt: now,
        lastLoginAt: now,
      })
      .where(eq(discordUsers.userId, discordUser.id))
      .returning();

    log.auth.success(`Utilisateur mis à jour: ${updated.username}`);
    return updated;
  }

  // Création d'un nouvel utilisateur (rôle MEMBER par défaut)
  const [newUser] = await db
    .insert(discordUsers)
    .values({
      userId: discordUser.id,
      username: discordUser.username,
      globalName: discordUser.global_name ?? null,
      nickname: guildMember?.nick ?? null,
      avatar: discordUser.avatar,
      email: discordUser.email ?? null,
      role: 'MEMBER',
      isActive: true,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    })
    .returning();

  log.auth.success(`Nouvel utilisateur créé: ${newUser.username} (rôle: MEMBER)`);
  return newUser;
}

/**
 * Crée une nouvelle session pour un utilisateur
 */
export async function createSession(userId: string): Promise<string> {
  const db = getDb();
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });

  log.auth.info(`Session créée pour userId: ${userId}`);
  return sessionId;
}

/**
 * Récupère une session et l'utilisateur associé
 */
export async function getSessionWithUser(sessionId: string): Promise<SessionData | null> {
  const db = getDb();

  const result = await db
    .select({
      session: sessions,
      user: discordUsers,
    })
    .from(sessions)
    .innerJoin(discordUsers, eq(sessions.userId, discordUsers.userId))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const { session, user } = result[0];

  // Vérifier si la session n'a pas expiré
  if (new Date(session.expiresAt) < new Date()) {
    log.auth.warn(`Session expirée: ${sessionId}`);
    await deleteSession(sessionId);
    return null;
  }

  return { user };
}

/**
 * Supprime une session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const db = getDb();
  await db.delete(sessions).where(eq(sessions.id, sessionId));
  log.auth.info(`Session supprimée: ${sessionId}`);
}

// ============================================================
// Cookie Helpers
// ============================================================
const COOKIE_NAME = 'trapotopia_session';

export function getSessionCookieOptions(isProduction: boolean) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000, // en secondes
  };
}

export { COOKIE_NAME };
