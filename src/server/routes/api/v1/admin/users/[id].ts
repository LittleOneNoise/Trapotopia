import { defineEventHandler, getCookie, createError, readBody } from 'h3';
import { eq } from 'drizzle-orm';
import { getDb } from '../../../../../../db';
import { discordUsers } from '../../../../../../db/schema';
import { getSessionWithUser, COOKIE_NAME } from '../../../../../services/session.service';
import { log } from '../../../../../../logger/logger';

interface UpdateUserBody {
  role?: 'MEMBER' | 'EVENTS_STAFF' | 'ADMIN';
  isActive?: boolean;
}

/**
 * PATCH /api/v1/admin/users/:id
 * Met à jour un utilisateur (admin uniquement)
 */
export default defineEventHandler(async (event) => {
  // Seules les requêtes PATCH sont acceptées
  if (event.method !== 'PATCH') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }

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

  const userId = Number(event.context['params']?.['id']);
  if (Number.isNaN(userId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID utilisateur invalide',
    });
  }

  const body = await readBody<UpdateUserBody>(event);
  const db = getDb();

  // Vérifier que l'utilisateur existe
  const [existingUser] = await db
    .select()
    .from(discordUsers)
    .where(eq(discordUsers.id, userId))
    .limit(1);

  if (!existingUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Utilisateur non trouvé',
    });
  }

  // Empêcher un admin de se retirer ses propres droits admin
  if (existingUser.userId === sessionData.user.userId && body.role && body.role !== 'ADMIN') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vous ne pouvez pas vous retirer vos propres droits admin',
    });
  }

  // Empêcher un admin de se désactiver lui-même
  if (existingUser.userId === sessionData.user.userId && body.isActive === false) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vous ne pouvez pas désactiver votre propre compte',
    });
  }

  // Construire les champs à mettre à jour
  const updateFields: Partial<{ role: typeof existingUser.role; isActive: boolean; updatedAt: Date }> = {
    updatedAt: new Date(),
  };

  if (body.role !== undefined) {
    const validRoles = ['MEMBER', 'EVENTS_STAFF', 'ADMIN'];
    if (!validRoles.includes(body.role)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Rôle invalide',
      });
    }
    updateFields.role = body.role;
  }

  if (body.isActive !== undefined) {
    updateFields.isActive = body.isActive;
  }

  log.admin.info(
    `Admin ${sessionData.user.username} met à jour l'utilisateur ${existingUser.username} (${userId}): ${JSON.stringify(body)}`
  );

  const [updatedUser] = await db
    .update(discordUsers)
    .set(updateFields)
    .where(eq(discordUsers.id, userId))
    .returning();

  return {
    user: {
      id: updatedUser.id,
      discordId: updatedUser.userId,
      username: updatedUser.username,
      globalName: updatedUser.globalName,
      nickname: updatedUser.nickname,
      avatar: updatedUser.avatar,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      lastLoginAt: updatedUser.lastLoginAt,
    },
  };
});
