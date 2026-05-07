import { FastifyRequest, FastifyReply } from 'fastify';
export declare const chartSummary: (req: FastifyRequest<{
    Body: {
        symbol: string;
        timeframe: string;
        context?: string;
    };
}>, reply: FastifyReply) => Promise<never>;
export declare const aiAsk: (req: FastifyRequest<{
    Body: {
        question: string;
        symbol?: string;
        chartContext?: string;
    };
}>, reply: FastifyReply) => Promise<never>;
export declare const detectPatterns: (req: FastifyRequest<{
    Body: {
        symbol: string;
        timeframe: string;
    };
}>, reply: FastifyReply) => Promise<never>;
//# sourceMappingURL=ai.controller.d.ts.map