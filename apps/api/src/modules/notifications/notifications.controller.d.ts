import { FastifyRequest, FastifyReply } from 'fastify';
export declare const listNotifications: (req: FastifyRequest<{
    Querystring: {
        read?: string;
        page?: string;
        limit?: string;
    };
}>, reply: FastifyReply) => Promise<never>;
export declare const markRead: (req: FastifyRequest<{
    Params: {
        id: string;
    };
}>, reply: FastifyReply) => Promise<never>;
export declare const markAllRead: (req: FastifyRequest, reply: FastifyReply) => Promise<never>;
export declare const clearRead: (req: FastifyRequest, reply: FastifyReply) => Promise<never>;
export declare const unreadCount: (req: FastifyRequest, reply: FastifyReply) => Promise<never>;
//# sourceMappingURL=notifications.controller.d.ts.map