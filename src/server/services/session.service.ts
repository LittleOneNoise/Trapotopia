import { eq } from 'drizzle-orm';
import { createHmac } from 'crypto';
import { getDb } from '../../db';
import { discordUsers, sessions, type DiscordUser } from '../../db/schema';
import { log } from '../../logger/logger';
import { env } from '../../config/env';
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
 * Génère un ID de session sécurisé (envoyé au client dans le cookie)
 */
function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash le sessionId avec HMAC-SHA256 pour le stockage en BDD.
 * Utilise SESSION_SECRET comme clé secrète.
 *
 * Sécurité : seul le hash est stocké en BDD, donc même si la BDD
 * est compromise, les sessionIds ne peuvent pas être récupérés.
 */
function hashSessionId(sessionId: string): string {
  return createHmac('sha256', env.SESSION_SECRET)
    .update(sessionId)
    .digest('hex');
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
 * Crée une nouvelle session pour un utilisateur.
 * Retourne le sessionId en clair (pour le cookie), mais stocke son hash en BDD.
 */
export async function createSession(userId: string): Promise<string> {
  const db = getDb();
  const sessionId = generateSessionId();
  const hashedSessionId = hashSessionId(sessionId);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(sessions).values({
    id: hashedSessionId, // On stocke le hash, pas le sessionId en clair
    userId,
    expiresAt,
  });

  log.auth.info(`Session créée pour userId: ${userId}`);
  return sessionId; // On retourne le sessionId en clair pour le cookie
}

/**
 * Récupère une session et l'utilisateur associé.
 * Le sessionId reçu (du cookie) est hashé avant comparaison avec la BDD.
 */
export async function getSessionWithUser(sessionId: string): Promise<SessionData | null> {
  const db = getDb();
  const hashedSessionId = hashSessionId(sessionId);

  const result = await db
    .select({
      session: sessions,
      user: discordUsers,
    })
    .from(sessions)
    .innerJoin(discordUsers, eq(sessions.userId, discordUsers.userId))
    .where(eq(sessions.id, hashedSessionId))
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
 * Supprime une session.
 * Le sessionId reçu est hashé avant recherche en BDD.
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const db = getDb();
  const hashedSessionId = hashSessionId(sessionId);
  await db.delete(sessions).where(eq(sessions.id, hashedSessionId));
  log.auth.info(`Session supprimée: ${hashedSessionId.substring(0, 8)}...`);
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
