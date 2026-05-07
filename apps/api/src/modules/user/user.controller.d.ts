import { FastifyRequest, FastifyReply } from 'fastify';
export declare const getUserSettings: (req: FastifyRequest, reply: FastifyReply) => Promise<never>;
export declare const updateUserSettings: (req: FastifyRequest<{
    Body: any;
}>, reply: FastifyReply) => Promise<never>;
export declare const getApiKeys: (req: FastifyRequest, reply: FastifyReply) => Promise<never>;
export declare const createApiKey: (req: FastifyRequest<{
    Body: {
        label: string;
    };
}>, reply: FastifyReply) => Promise<never>;
export declare const revokeApiKey: (req: FastifyRequest<{
    Params: {
        id: string;
    };
}>, reply: FastifyReply) => Promise<never>;
//# sourceMappingURL=user.controller.d.ts.map