import { FastifyRequest, FastifyReply } from 'fastify';
export declare class WatchlistController {
    static getWatchlists(req: FastifyRequest, reply: FastifyReply): Promise<({
        symbols: {
            symbol: string;
            exchange: string | null;
            id: string;
            watchlistId: string;
            assetClass: import("@prisma/client").$Enums.AssetClass;
            sortOrder: number;
            addedAt: Date;
        }[];
    } & {
        id: string;
        userId: string;
        name: string;
        isDefault: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    static createWatchlist(req: FastifyRequest<{
        Body: {
            name: string;
        };
    }>, reply: FastifyReply): Promise<{
        symbols: {
            symbol: string;
            exchange: string | null;
            id: string;
            watchlistId: string;
            assetClass: import("@prisma/client").$Enums.AssetClass;
            sortOrder: number;
            addedAt: Date;
        }[];
    } & {
        id: string;
        userId: string;
        name: string;
        isDefault: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static addSymbol(req: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: {
            symbol: string;
            exchange?: string;
        };
    }>, reply: FastifyReply): Promise<any>;
    static deleteSymbol(req: FastifyRequest<{
        Params: {
            id: string;
            symbolId: string;
        };
    }>, reply: FastifyReply): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=watchlist.controller.d.ts.map