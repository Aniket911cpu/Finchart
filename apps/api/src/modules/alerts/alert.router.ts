import { FastifyInstance } from 'fastify';
import { createAlert, getAlerts, deleteAlert } from './alert.controller';

export async function alertRouter(fastify: FastifyInstance) {
  // All routes are prefixed with /alerts and protected by JWT
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.post('/', createAlert);
  fastify.get('/', getAlerts);
  fastify.delete('/:id', deleteAlert);
}
