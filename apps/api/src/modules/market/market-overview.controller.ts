import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../shared/prisma';
import { redis } from '../../shared/redis';

export const getMarketStats = async (req: FastifyRequest, reply: FastifyReply) => {
  // Mock data for MVP: global market cap, volume, btc dominance, fear and greed index
  return reply.send({
    globalMarketCap: 2500000000000,
    volume24h: 85000000000,
    btcDominance: 52.4,
    fearAndGreed: { value: 74, classification: "Greed" }
  });
};

export const getTrendingSymbols = async (req: FastifyRequest<{ Querystring: { limit?: string } }>, reply: FastifyReply) => {
  const limit = parseInt(req.query.limit || '10');
  
  // Mock trending data
  const trending = [
    { symbol: 'BTC/USDT', name: 'Bitcoin', change24h: 2.5, price: 68500 },
    { symbol: 'ETH/USDT', name: 'Ethereum', change24h: 4.1, price: 3800 },
    { symbol: 'SOL/USDT', name: 'Solana', change24h: 8.7, price: 155 },
    { symbol: 'DOGE/USDT', name: 'Dogecoin', change24h: -1.2, price: 0.16 },
    { symbol: 'NVDA', name: 'Nvidia', change24h: 3.5, price: 950 },
    { symbol: 'AAPL', name: 'Apple', change24h: 1.1, price: 175 },
    { symbol: 'TSLA', name: 'Tesla', change24h: -2.3, price: 170 },
    { symbol: 'AMZN', name: 'Amazon', change24h: 0.8, price: 185 },
    { symbol: 'MSFT', name: 'Microsoft', change24h: 1.5, price: 420 },
    { symbol: 'META', name: 'Meta', change24h: 2.2, price: 505 }
  ];

  return reply.send(trending.slice(0, limit));
};

export const getTopMovers = async (req: FastifyRequest<{ Querystring: { type?: 'gainers' | 'losers' } }>, reply: FastifyReply) => {
  const type = req.query.type || 'gainers';
  
  if (type === 'gainers') {
    return reply.send([
      { symbol: 'PEPE/USDT', name: 'Pepe', change24h: 24.5, price: 0.0000105 },
      { symbol: 'WIF/USDT', name: 'Dogwifhat', change24h: 18.2, price: 3.20 },
      { symbol: 'SOL/USDT', name: 'Solana', change24h: 8.7, price: 155 },
    ]);
  } else {
    return reply.send([
      { symbol: 'ENA/USDT', name: 'Ethena', change24h: -12.4, price: 0.85 },
      { symbol: 'ORDI/USDT', name: 'ORDI', change24h: -8.1, price: 45.2 },
      { symbol: 'TSLA', name: 'Tesla', change24h: -2.3, price: 170 },
    ]);
  }
};

export const getNewsFeed = async (req: FastifyRequest<{ Querystring: { symbol?: string, limit?: string } }>, reply: FastifyReply) => {
  // Mock news feed
  const news = [
    { id: '1', title: 'Bitcoin ETFs see record inflows as price nears ATH', source: 'CoinDesk', url: '#', publishedAt: new Date().toISOString() },
    { id: '2', title: 'Tech stocks rally on strong earnings guidance', source: 'Bloomberg', url: '#', publishedAt: new Date(Date.now() - 3600000).toISOString() },
    { id: '3', title: 'Federal Reserve holds interest rates steady', source: 'Reuters', url: '#', publishedAt: new Date(Date.now() - 7200000).toISOString() },
    { id: '4', title: 'Ethereum network upgrade successfully deployed', source: 'Decrypt', url: '#', publishedAt: new Date(Date.now() - 14400000).toISOString() },
  ];
  return reply.send(news);
};
