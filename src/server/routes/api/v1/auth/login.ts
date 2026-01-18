import { defineEventHandler, sendRedirect, setCookie } from 'h3';
import { getDiscordAuthUrl } from '../../../../services/discord.service';
import { log } from '../../../../../logger/logger';
import { env } from '../../../../../config/env';

/** Nom du cookie pour le state OAuth2 */
export const OAUTH_STATE_COOKIE = 'oauth_state';

/**
 * GET /api/v1/auth/login
 * Redirige l'utilisateur vers la page d'autorisation Discord
 */
export default defineEventHandler(async (event) => {
  log.auth.info('Démarrage du flux OAuth2 Discord');

  // Génère un state aléatoire pour la protection CSRF
  const state = crypto.randomUUID();

  // Stocke le state dans un cookie sécurisé pour vérification au callback
  const isProduction = env.MODE === 'production';
  setCookie(event, OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10, // 10 minutes - le temps de compléter le flux OAuth
  });

  const authUrl = getDiscordAuthUrl(state);
  log.auth.debug(`Redirection vers: ${authUrl}`);

  return sendRedirect(event, authUrl, 302);
});
