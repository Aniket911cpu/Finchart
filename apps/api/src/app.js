import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { pino } from 'pino';
import marketRoutes from './modules/market/market.router';
import layoutRoutes from './modules/layouts/layout.router';
import watchlistRoutes from './modules/watchlists/watchlist.router';
import { alertRouter } from './modules/alerts/alert.router';
import userRoutes from './modules/user/user.router';
import authRoutes from './modules/auth/auth.router';
import notificationsRoutes from './modules/notifications/notifications.router';
import aiRoutes from './modules/ai/ai.router';
export function buildApp() {
    const app = Fastify({
        logger: pino({
            transport: { target: 'pino-pretty' },
            level: 'info',
        }),
    });
    app.register(cors, { origin: '*' });
    app.register(fastifyJwt, {
        secret: process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret'
    });
    app.decorate('authenticate', async function (request, reply) {
        try {
            await request.jwtVerify();
        }
        catch (err) {
            reply.send(err);
        }
    });
    // Health check
    app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));
    // Public routes
    app.register(authRoutes, { prefix: '/auth' });
    // Market routes (UDF + Overview — mostly public)
    app.register(marketRoutes, { prefix: '/market' });
    // Protected routes
    app.register(async (protectedApp) => {
        // @ts-ignore
        protectedApp.addHook('onRequest', protectedApp.authenticate);
        protectedApp.register(layoutRoutes, { prefix: '/layouts' });
        protectedApp.register(watchlistRoutes, { prefix: '/watchlists' });
        protectedApp.register(alertRouter, { prefix: '/alerts' });
        protectedApp.register(userRoutes, { prefix: '/user' });
        protectedApp.register(notificationsRoutes, { prefix: '/notifications' });
        protectedApp.register(aiRoutes, { prefix: '/ai' });
    });
    return app;
}
//# sourceMappingURL=app.js.map