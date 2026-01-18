import { defineEventHandler, getCookie } from 'h3';
import { getSessionWithUser, COOKIE_NAME } from '../../../../services/session.service';
import { log } from '../../../../../logger/logger';

/**
 * GET /api/v1/auth/me
 * Retourne les informations de l'utilisateur connecté
 */
export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, COOKIE_NAME);

  if (!sessionId) {
    return { user: null };
  }

  const sessionData = await getSessionWithUser(sessionId);

  if (!sessionData) {
    return { user: null };
  }

  log.auth.debug(`Utilisateur authentifié: ${sessionData.user.username}`);

  // Retourner les informations publiques de l'utilisateur
  const { user } = sessionData;
  return {
    user: {
      id: user.id,
      discordId: user.userId, // ID Discord pour l'avatar
      username: user.username,
      globalName: user.globalName, // Nom d'affichage Discord global
      nickname: user.nickname, // Pseudo sur le serveur Discord
      avatar: user.avatar,
      role: user.role,
    },
  };
});
