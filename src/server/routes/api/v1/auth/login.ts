import { defineEventHandler, sendRedirect } from 'h3';
import { getDiscordAuthUrl } from '../../../../services/discord.service';
import { log } from '../../../../../logger/logger';

/**
 * GET /api/v1/auth/login
 * Redirige l'utilisateur vers la page d'autorisation Discord
 */
export default defineEventHandler(async (event) => {
  log.auth.info('Démarrage du flux OAuth2 Discord');

  // Génère un state aléatoire pour la protection CSRF
  const state = crypto.randomUUID();

  // TODO: Stocker le state en cookie pour vérification au callback
  // Pour l'instant, on skip cette étape pour simplifier

  const authUrl = getDiscordAuthUrl(state);
  log.auth.debug(`Redirection vers: ${authUrl}`);

  return sendRedirect(event, authUrl, 302);
});
