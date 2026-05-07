import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import Redis from 'ioredis';
import { subscribeClient, unsubscribeClient, removeClientFromAll, broadcastToChannel } from './subscriptions';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3002;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const app = Fastify({ logger: true });
app.register(fastifyWebsocket);

// Redis connection for subscribing to pub/sub
const redisSubscriber = new Redis(REDIS_URL);

redisSubscriber.psubscribe('market:*', (err, count) => {
  if (err) {
    console.error('Failed to psubscribe:', err);
  } else {
    console.log(`Subscribed to ${count} Redis patterns`);
  }
});

redisSubscriber.on('pmessage', (pattern, channel, message) => {
  // Broadcast this tick to any connected WS clients listening to this channel
  broadcastToChannel(channel, message);
});

app.register(async function (fastify) {
  fastify.get('/', { websocket: true }, (connection, req) => {
    
    connection.socket.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        
        if (data.event === 'subscribe') {
          const { symbol, timeframe } = data.payload;
          if (symbol && timeframe) {
            subscribeClient(connection.socket as any, symbol, timeframe);
          }
        } else if (data.event === 'unsubscribe') {
          const { symbol, timeframe } = data.payload;
          if (symbol && timeframe) {
            unsubscribeClient(connection.socket as any, symbol, timeframe);
          }
        } else if (data.event === 'ping') {
          connection.socket.send(JSON.stringify({ event: 'pong' }));
        }
      } catch (err) {
        // Invalid JSON or message format
      }
    });

    connection.socket.on('close', () => {
      removeClientFromAll(connection.socket as any);
    });
  });
});

async function start() {
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`WS Gateway listening on port ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
