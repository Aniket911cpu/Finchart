import { FastifyInstance } from 'fastify';
import { register, login, getMe, forgotPassword, logout } from './auth.controller';

export default async function authRoutes(app: FastifyInstance) {
  app.post('/register', register);
  app.post('/login', login);
  app.post('/forgot-password', forgotPassword);

  // Protected
  app.get('/me', { onRequest: [app.authenticate] } as any, getMe);
  app.post('/logout', { onRequest: [app.authenticate] } as any, logout);
}
