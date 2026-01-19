import { defineEventHandler, getCookie, createError } from 'h3';
import { getDb } from '../../../../../db';
import { discordUsers } from '../../../../../db/schema';
import { getSessionWithUser, COOKIE_NAME } from '../../../../services/session.service';
import { log } from '../../../../../logger/logger';

/**
 * GET /api/v1/admin/users
 * Retourne la liste de tous les utilisateurs (admin uniquement)
 */
export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, COOKIE_NAME);

  if (!sessionId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Non authentifié',
    });
  }

  const sessionData = await getSessionWithUser(sessionId);

  if (!sessionData) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Session invalide',
    });
  }

  // Vérifier que l'utilisateur est admin
  if (sessionData.user.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Accès refusé - Admin uniquement',
    });
  }

  const db = getDb();

  log.admin.info(`Admin ${sessionData.user.username} récupère la liste des utilisateurs`);

  const users = await db
    .select({
      id: discordUsers.id,
      discordId: discordUsers.userId,
      username: discordUsers.username,
      globalName: discordUsers.globalName,
      nickname: discordUsers.nickname,
      avatar: discordUsers.avatar,
      email: discordUsers.email,
      role: discordUsers.role,
      isActive: discordUsers.isActive,
      createdAt: discordUsers.createdAt,
      updatedAt: discordUsers.updatedAt,
      lastLoginAt: discordUsers.lastLoginAt,
    })
    .from(discordUsers)
    .orderBy(discordUsers.createdAt);

  return { users };
});
