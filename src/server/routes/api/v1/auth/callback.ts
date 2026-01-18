import { defineEventHandler, getQuery, sendRedirect, setCookie, getCookie, deleteCookie } from 'h3';
import {
  exchangeCodeForToken,
  getDiscordUser,
  checkGuildMembership
} from '../../../../services/discord.service';
import {
  upsertUser,
  createSession,
  COOKIE_NAME,
  getSessionCookieOptions
} from '../../../../services/session.service';
import { log } from '../../../../../logger/logger';
import { env } from '../../../../../config/env';
import { OAUTH_STATE_COOKIE } from './login';

/**
 * GET /api/v1/auth/callback
 * Callback OAuth2 Discord - échange le code contre un token et crée la session
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query['code'] as string | undefined;
  const state = query['state'] as string | undefined;
  const error = query['error'] as string | undefined;
  const errorDescription = query['error_description'] as string | undefined;

  // Gestion des erreurs Discord
  if (error) {
    log.auth.error(`Erreur OAuth2 Discord: ${error} - ${errorDescription}`);
    deleteCookie(event, OAUTH_STATE_COOKIE);
    return sendRedirect(event, '/?error=discord_auth_failed', 302);
  }

  if (!code) {
    log.auth.error('Code d\'autorisation manquant');
    deleteCookie(event, OAUTH_STATE_COOKIE);
    return sendRedirect(event, '/?error=missing_code', 302);
  }

  // Vérification CSRF : compare le state reçu avec celui stocké en cookie
  const storedState = getCookie(event, OAUTH_STATE_COOKIE);
  deleteCookie(event, OAUTH_STATE_COOKIE); // Supprime le cookie après lecture (usage unique)

  if (!state || !storedState || state !== storedState) {
    log.auth.error('State OAuth2 invalide - possible attaque CSRF');
    return sendRedirect(event, '/?error=invalid_state', 302);
  }

  try {
    // 1. Échanger le code contre un token d'accès
    const tokenResponse = await exchangeCodeForToken(code);
    log.auth.debug('Token obtenu avec succès');

    // 2. Récupérer les informations de l'utilisateur
    const discordUser = await getDiscordUser(tokenResponse.access_token);
    log.auth.info(`Utilisateur Discord: ${discordUser.username} (${discordUser.id})`);

    // 3. Vérifier l'appartenance au serveur Discord autorisé
    const guildMember = await checkGuildMembership(tokenResponse.access_token);

    if (!guildMember) {
      log.auth.warn(`Accès refusé: ${discordUser.username} n'est pas membre du serveur`);
      return sendRedirect(event, '/?error=not_guild_member', 302);
    }

    log.auth.success(`Membre vérifié: ${discordUser.username} est sur le serveur`);

    // 4. Créer ou mettre à jour l'utilisateur en base
    const user = await upsertUser(discordUser);

    // 5. Créer une session
    const sessionId = await createSession(user.userId);

    // 6. Définir le cookie de session
    const isProduction = env.MODE === 'production';
    setCookie(event, COOKIE_NAME, sessionId, getSessionCookieOptions(isProduction));

    log.auth.success(`Connexion réussie pour: ${user.username}`);

    // 7. Rediriger vers la page d'accueil
    return sendRedirect(event, '/', 302);

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    log.auth.error(`Erreur callback OAuth2: ${message}`);
    return sendRedirect(event, '/?error=auth_failed', 302);
  }
});
