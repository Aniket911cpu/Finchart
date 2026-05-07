import { UdfController } from './udf.controller';
import { getMarketStats, getTrendingSymbols, getTopMovers, getNewsFeed } from './market-overview.controller';
export default async function udfRoutes(app) {
    // UDF Endpoints
    app.get('/config', UdfController.config);
    app.get('/time', UdfController.time);
    app.get('/symbols', UdfController.symbols);
    app.get('/search', UdfController.search);
    app.get('/history', UdfController.history);
    // Overview Endpoints
    app.get('/stats', getMarketStats);
    app.get('/trending', getTrendingSymbols);
    app.get('/movers', getTopMovers);
    app.get('/news', getNewsFeed);
}
//# sourceMappingURL=market.router.js.map