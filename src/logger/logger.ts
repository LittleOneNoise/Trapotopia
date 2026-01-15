import { createConsola, LogLevels } from 'consola';
import { env } from '../config/env';

const isDev = env.MODE === 'development';

export const logger = createConsola({
  level: isDev ? LogLevels.debug : LogLevels.info,
  formatOptions: {
    date: true,
    colors: true,
    compact: !isDev,
  },
});

// Loggers avec tags prédéfinis pour différents modules
export const dbLogger = logger.withTag('DB');
export const apiLogger = logger.withTag('API');
export const authLogger = logger.withTag('AUTH');
