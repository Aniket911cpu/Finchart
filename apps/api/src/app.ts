import Fastify from 'fastify';
import cors from '@fastify/cors';
import { pino } from 'pino';
import udfRoutes from './modules/market/market.router';

export function buildApp() {
  const app = Fastify({
    logger: pino({
      transport: {
        target: 'pino-pretty',
      },
      level: 'info',
    }),
  });

  app.register(cors, {
    origin: '*', // For dev
  });

  // Health check
  app.get('/health', async () => ({ status: 'ok' }));

  // Register UDF routes
  app.register(udfRoutes, { prefix: '/udf' });

  return app;
}
