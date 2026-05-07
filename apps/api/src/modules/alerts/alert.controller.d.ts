import { FastifyReply, FastifyRequest } from 'fastify';
export declare function createAlert(request: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function getAlerts(request: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function deleteAlert(request: FastifyRequest<{
    Params: {
        id: string;
    };
}>, reply: FastifyReply): Promise<never>;
//# sourceMappingURL=alert.controller.d.ts.map