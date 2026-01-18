import { config } from 'dotenv';

/**
 * Charge les variables d'environnement depuis le bon fichier .env
 * selon NODE_ENV ou le mode Vite.
 *
 * Convention de nommage Vite :
 * - .env                 → Chargé dans tous les cas
 * - .env.local           → Chargé dans tous les cas, ignoré par git
 * - .env.development     → Chargé uniquement en mode dev
 * - .env.production      → Chargé uniquement en mode prod
 */

// Priorité : NODE_ENV > import.meta.env.MODE > 'development'
function getEnvMode(): 'development' | 'production' {
  if (process.env['NODE_ENV'] === 'production') return 'production';
  if (import.meta?.env?.MODE === 'production') return 'production';
  return 'development';
}

const mode = getEnvMode();
const envFile = mode === 'production' ? '.env.production' : '.env.development';

// Charge le fichier .env correspondant (ne surcharge pas les variables existantes)
config({ path: envFile });

// Charge aussi .env.local s'il existe (pour les secrets locaux)
config({ path: '.env.local' });

// ============================================================
// Export des variables d'environnement typées
// ============================================================
export const env = {
  MODE: mode,
  DATABASE_URL: process.env['DATABASE_URL'] ?? '',

  // Discord OAuth2
  DISCORD_CLIENT_ID: process.env['DISCORD_CLIENT_ID'] ?? '',
  DISCORD_CLIENT_SECRET: process.env['DISCORD_CLIENT_SECRET'] ?? '',
  DISCORD_REDIRECT_URI: process.env['DISCORD_REDIRECT_URI'] ?? '',
  DISCORD_GUILD_ID: process.env['DISCORD_GUILD_ID'] ?? '',

  // Session
  SESSION_SECRET: process.env['SESSION_SECRET'] ?? '',
} as const;

// Validation au démarrage
export function validateEnv(): void {
  const required = [
    'DATABASE_URL',
    'DISCORD_CLIENT_ID',
    'DISCORD_CLIENT_SECRET',
    'DISCORD_REDIRECT_URI',
    'DISCORD_GUILD_ID',
    'SESSION_SECRET',
  ] as const;
  const missing = required.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(`❌ Variables d'environnement manquantes: ${missing.join(', ')}`);
  }
}

