import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle as drizzleNeon, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import { Pool } from 'pg';
import * as schema from './schema';
import { log } from '../logger/logger';
import { env } from '../config/env';

// ============================================================
// Configuration
// ============================================================
const config = {
  connectionString: env.DATABASE_URL,
  isDev: env.MODE === 'development',
  pool: {
    connectionTimeoutMillis: 2000,
    idleTimeoutMillis: 30000,
    max: 10, // Nombre max de connexions dans le pool
  },
} as const;

// ============================================================
// Types
// ============================================================
type NeonDB = NeonHttpDatabase<typeof schema>;
type PgDB = NodePgDatabase<typeof schema>;
export type Database = NeonDB | PgDB;

interface DbConnection {
  db: Database;
  pool?: Pool; // Uniquement en mode dev pour pouvoir fermer proprement
}

// ============================================================
// Singleton - Lazy Initialization
// ============================================================
let connection: DbConnection | null = null;

function createConnection(): DbConnection {
  const { connectionString, isDev, pool: poolConfig } = config;

  if (!connectionString) {
    throw new Error('DATABASE_URL est manquant dans les variables d\'environnement.');
  }

  if (isDev) {
    // --- MODE DEV : Connexion locale avec pool PostgreSQL ---
    log.db.info('Mode LOCAL (pg pool)');

    const pool = new Pool({
      connectionString,
      ...poolConfig,
    });

    pool.on('error', (err) => {
      log.db.error('Erreur inattendue sur le pool PostgreSQL:', err.message);
    });

    return {
      db: drizzlePg(pool, { schema }),
      pool,
    };
  }

  // --- MODE PROD : Connexion Serverless Neon ---
  log.db.info('Mode NEON (serverless)');

  const client: NeonQueryFunction<false, false> = neon(connectionString);
  return {
    db: drizzleNeon(client, { schema }),
  };
}

/**
 * Récupère l'instance de la base de données (lazy initialization).
 * Crée la connexion au premier appel, puis réutilise l'instance existante.
 */
export function getDb(): Database {
  connection ??= createConnection();
  return connection.db;
}

// Export direct pour rétrocompatibilité (accès via `db` directement)
export const db: Database = new Proxy({} as Database, {
  get(_, prop) {
    return Reflect.get(getDb(), prop);
  },
});

// ============================================================
// Health Check
// ============================================================
export async function checkDbConnection(): Promise<boolean> {
  try {
    const database = getDb();
    // Requête ultra-légère : SELECT 1
    await database.execute(sql`SELECT 1`);
    log.db.success('Connexion fonctionnelle');
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log.db.error('Connexion échouée:', message);
    return false;
  }
}

// ============================================================
// Cleanup - Fermeture propre des connexions
// ============================================================
export async function closeDbConnection(): Promise<void> {
  if (connection?.pool) {
    log.db.info('Fermeture du pool de connexions...');
    await connection.pool.end();
    connection = null;
    log.db.success('Pool fermé');
  }
}

