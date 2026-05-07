import { prisma } from '../../shared/prisma';
export class WatchlistController {
    static async getWatchlists(req, reply) {
        const userId = req.user?.sub;
        if (!userId)
            return reply.code(401).send({ error: "Unauthorized" });
        const watchlists = await prisma.watchlist.findMany({
            where: { userId },
            include: { symbols: true }
        });
        return watchlists;
    }
    static async createWatchlist(req, reply) {
        const userId = req.user?.sub;
        if (!userId)
            return reply.code(401).send({ error: "Unauthorized" });
        const { name } = req.body;
        const watchlist = await prisma.watchlist.create({
            data: {
                userId,
                name
            },
            include: { symbols: true }
        });
        return watchlist;
    }
    static async addSymbol(req, reply) {
        const userId = req.user?.sub;
        if (!userId)
            return reply.code(401).send({ error: "Unauthorized" });
        const { id } = req.params;
        const { symbol, exchange } = req.body;
        const watchlist = await prisma.watchlist.findUnique({ where: { id } });
        if (!watchlist || watchlist.userId !== userId) {
            return reply.code(404).send({ error: "Not found" });
        }
        // Get current max orderIndex
        const currentSymbols = await prisma.watchlistSymbol.findMany({ where: { watchlistId: id }, orderBy: { orderIndex: 'desc' }, take: 1 });
        const orderIndex = currentSymbols.length > 0 ? currentSymbols[0].orderIndex + 1 : 0;
        const wlSymbol = await prisma.watchlistSymbol.create({
            data: {
                watchlistId: id,
                symbol,
                exchange: exchange || 'BINANCE',
                orderIndex
            }
        });
        return wlSymbol;
    }
    static async deleteSymbol(req, reply) {
        const userId = req.user?.sub;
        if (!userId)
            return reply.code(401).send({ error: "Unauthorized" });
        const { id, symbolId } = req.params;
        const watchlist = await prisma.watchlist.findUnique({ where: { id } });
        if (!watchlist || watchlist.userId !== userId) {
            return reply.code(404).send({ error: "Not found" });
        }
        await prisma.watchlistSymbol.delete({
            where: { id: symbolId, watchlistId: id }
        });
        return { success: true };
    }
}
//# sourceMappingURL=watchlist.controller.js.map