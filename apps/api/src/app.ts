import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { pino } from 'pino';
import udfRoutes from './modules/market/udf.controller'; // Ensure correct import for UDF routes
import layoutRoutes from './modules/layouts/layout.router';
import watchlistRoutes from './modules/watchlists/watchlist.router';
import { alertRouter } from './modules/alerts/alert.router';

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

  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret'
  });

  app.decorate("authenticate", async function(request: any, reply: any) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  });

  // Health check
  app.get('/health', async () => ({ status: 'ok' }));

  // Register UDF routes
  app.register(udfRoutes, { prefix: '/udf' });

  // Protected routes
  app.register(async (protectedApp) => {
    // @ts-ignore
    protectedApp.addHook('onRequest', protectedApp.authenticate);
    protectedApp.register(layoutRoutes, { prefix: '/layouts' });
    protectedApp.register(watchlistRoutes, { prefix: '/watchlists' });
    protectedApp.register(alertRouter, { prefix: '/alerts' });
  });

  return app;
}
