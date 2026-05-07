import { FastifyRequest, FastifyReply } from 'fastify';
export declare const register: (req: FastifyRequest<{
    Body: {
        email: string;
        password: string;
        username: string;
        displayName?: string;
    };
}>, reply: FastifyReply) => Promise<never>;
export declare const login: (req: FastifyRequest<{
    Body: {
        email: string;
        password: string;
    };
}>, reply: FastifyReply) => Promise<never>;
export declare const getMe: (req: FastifyRequest, reply: FastifyReply) => Promise<never>;
export declare const forgotPassword: (req: FastifyRequest<{
    Body: {
        email: string;
    };
}>, reply: FastifyReply) => Promise<never>;
export declare const logout: (req: FastifyRequest, reply: FastifyReply) => Promise<never>;
//# sourceMappingURL=auth.controller.d.ts.map