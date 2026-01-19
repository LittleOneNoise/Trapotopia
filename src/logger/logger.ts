import { createConsola, LogLevels, type ConsolaInstance } from 'consola';
import { env } from '../config/env';

const isDev = env.MODE === 'development';

// Logger principal
export const logger = createConsola({
  level: isDev ? LogLevels.debug : LogLevels.info,
  formatOptions: {
    date: true,
    colors: true,
    compact: !isDev,
  },
});

// Factory pour créer des loggers avec tag
export const createLogger = (tag: string): ConsolaInstance => logger.withTag(tag);

// Loggers pré-configurés pour les différents modules
export const log = {
  db: createLogger('DB'),
  discord: createLogger('DISCORD'),
  auth: createLogger('AUTH'),
  api: createLogger('API'),
  admin: createLogger('ADMIN'),
} as const;
