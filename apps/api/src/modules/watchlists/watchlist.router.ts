import { FastifyInstance } from 'fastify';
import { WatchlistController } from './watchlist.controller';

export default async function watchlistRoutes(app: FastifyInstance) {
  app.get('/', WatchlistController.getWatchlists);
  app.post('/', WatchlistController.createWatchlist);
  app.post('/:id/symbols', WatchlistController.addSymbol);
  app.delete('/:id/symbols/:symbolId', WatchlistController.deleteSymbol);
}
