import { FastifyInstance } from 'fastify';
import { UdfController } from './udf.controller';

export default async function udfRoutes(app: FastifyInstance) {
  app.get('/config', UdfController.config);
  app.get('/time', UdfController.time);
  app.get('/symbols', UdfController.symbols);
  app.get('/search', UdfController.search);
  app.get('/history', UdfController.history);
}
