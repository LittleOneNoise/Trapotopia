import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// Charge le bon fichier .env selon l'environnement
const envFile = process.env['NODE_ENV'] === 'production' ? '.env.production' : '.env.development';
config({ path: envFile });

export default defineConfig({
  // Schéma de la base de données
  schema: './src/db/schema.ts',

  // Dossier de sortie des migrations
  out: './src/db/migrations',

  // Dialecte de la base de données
  dialect: 'postgresql',

  // Configuration de la connexion
  dbCredentials: {
    url: process.env['DATABASE_URL']!,
  },

  // Schéma PostgreSQL cible
  schemaFilter: ['sc_trapotopia'],

  // Options supplémentaires
  verbose: true,
  strict: true,
});

