import { env } from '../../config/env';
import { log } from '../../logger/logger';

// ============================================================
// Types
// ============================================================
export interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
  global_name?: string;
}

export interface DiscordGuildMember {
  user: DiscordUser;
  nick: string | null;
  roles: string[];
  joined_at: string;
}

// ============================================================
// OAuth2 URLs
// ============================================================
const DISCORD_API_BASE = 'https://discord.com/api/v10';
const DISCORD_OAUTH_URL = 'https://discord.com/api/oauth2';

/**
 * Génère l'URL d'autorisation Discord OAuth2
 */
export function getDiscordAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    redirect_uri: env.DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify email guilds.members.read',
  });

  if (state) {
    params.append('state', state);
  }

  return `${DISCORD_OAUTH_URL}/authorize?${params.toString()}`;
}

/**
 * Échange le code d'autorisation contre un token d'accès
 */
export async function exchangeCodeForToken(code: string): Promise<DiscordTokenResponse> {
  log.discord.info('Échange du code contre un token...');

  const response = await fetch(`${DISCORD_OAUTH_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: env.DISCORD_REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    log.discord.error('Erreur échange token:', error);
    throw new Error(`Échec de l'échange du token: ${response.status}`);
  }

  return await response.json() as Promise<DiscordTokenResponse>;
}

/**
 * Récupère les informations de l'utilisateur Discord
 */
export async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  log.discord.info('Récupération des informations utilisateur...');

  const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    log.discord.error('Erreur récupération utilisateur:', error);
    throw new Error(`Échec de la récupération de l'utilisateur: ${response.status}`);
  }

  return response.json() as Promise<DiscordUser>;
}

/**
 * Vérifie si l'utilisateur est membre du serveur Discord autorisé
 */
export async function checkGuildMembership(accessToken: string): Promise<DiscordGuildMember | null> {
  log.discord.info(`Vérification de l'appartenance au serveur ${env.DISCORD_GUILD_ID}...`);

  const response = await fetch(
    `${DISCORD_API_BASE}/users/@me/guilds/${env.DISCORD_GUILD_ID}/member`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.status === 404) {
    log.discord.warn('Utilisateur non membre du serveur autorisé');
    return null;
  }

  if (!response.ok) {
    const error = await response.text();
    log.discord.error('Erreur vérification guild:', error);
    throw new Error(`Échec de la vérification du serveur: ${response.status}`);
  }

  return response.json() as Promise<DiscordGuildMember>;
}
