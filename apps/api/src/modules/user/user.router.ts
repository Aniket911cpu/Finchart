import { FastifyInstance } from 'fastify';
import { getUserSettings, updateUserSettings, getApiKeys, createApiKey, revokeApiKey } from './user.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

export default async function userRoutes(app: FastifyInstance) {
  // All user routes require authentication
  app.addHook('onRequest', authMiddleware);

  app.get('/settings', getUserSettings);
  app.patch('/settings', updateUserSettings);
  
  app.get('/api-keys', getApiKeys);
  app.post('/api-keys', createApiKey);
  app.delete('/api-keys/:id', revokeApiKey);
}
