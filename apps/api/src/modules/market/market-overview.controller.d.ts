import { FastifyRequest, FastifyReply } from 'fastify';
export declare const getMarketStats: (req: FastifyRequest, reply: FastifyReply) => Promise<never>;
export declare const getTrendingSymbols: (req: FastifyRequest<{
    Querystring: {
        limit?: string;
    };
}>, reply: FastifyReply) => Promise<never>;
export declare const getTopMovers: (req: FastifyRequest<{
    Querystring: {
        type?: "gainers" | "losers";
    };
}>, reply: FastifyReply) => Promise<never>;
export declare const getNewsFeed: (req: FastifyRequest<{
    Querystring: {
        symbol?: string;
        limit?: string;
    };
}>, reply: FastifyReply) => Promise<never>;
//# sourceMappingURL=market-overview.controller.d.ts.map