import { FastifyInstance } from 'fastify';
import { chartSummary, aiAsk, detectPatterns } from './ai.controller';

export default async function aiRoutes(app: FastifyInstance) {
  app.post('/chart-summary', chartSummary);
  app.post('/ask', aiAsk);
  app.post('/patterns', detectPatterns);
}
