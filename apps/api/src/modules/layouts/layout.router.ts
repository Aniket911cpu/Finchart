import { FastifyInstance } from 'fastify';
import { LayoutController } from './layout.controller';

export default async function layoutRoutes(app: FastifyInstance) {
  // Routes are protected via onRequest hook in app.ts
  app.get('/', LayoutController.getLayouts);
  app.post('/', LayoutController.createLayout);
  app.put('/:id', LayoutController.updateLayout);
  app.delete('/:id', LayoutController.deleteLayout);
}
