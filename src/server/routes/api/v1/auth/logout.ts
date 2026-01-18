import { defineEventHandler, getCookie, deleteCookie, sendRedirect } from 'h3';
import { deleteSession, COOKIE_NAME } from '../../../../services/session.service';
import { log } from '../../../../../logger/logger';

/**
 * GET /api/v1/auth/logout
 * Déconnecte l'utilisateur en supprimant sa session
 */
export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, COOKIE_NAME);

  if (sessionId) {
    await deleteSession(sessionId);
    log.auth.info('Utilisateur déconnecté');
  }

  // Supprimer le cookie
  deleteCookie(event, COOKIE_NAME, {
    path: '/',
  });

  return sendRedirect(event, '/', 302);
});
