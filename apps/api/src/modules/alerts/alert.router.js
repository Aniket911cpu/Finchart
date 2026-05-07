import { createAlert, getAlerts, deleteAlert } from './alert.controller';
export async function alertRouter(fastify) {
    // All routes are prefixed with /alerts and protected by JWT
    fastify.addHook('onRequest', fastify.authenticate);
    fastify.post('/', createAlert);
    fastify.get('/', getAlerts);
    fastify.delete('/:id', deleteAlert);
}
//# sourceMappingURL=alert.router.js.map