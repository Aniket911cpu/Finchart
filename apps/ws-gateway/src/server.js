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
redisSubscriber.psubscribe('market:*', 'alerts:*', (err, count) => {
    if (err) {
        console.error('Failed to psubscribe:', err);
    }
    else {
        console.log(`Subscribed to ${count} Redis patterns`);
    }
});
redisSubscriber.on('pmessage', (pattern, channel, message) => {
    // Broadcast this message to any connected WS clients listening to this channel
    broadcastToChannel(channel, message);
});
app.register(async function (fastify) {
    fastify.get('/', { websocket: true }, (socket, req) => {
        socket.on('message', (message) => {
            try {
                const data = JSON.parse(message.toString());
                if (data.event === 'subscribe') {
                    const { symbol, timeframe } = data.payload;
                    if (symbol && timeframe) {
                        subscribeClient(socket, `market:${symbol}:${timeframe}`);
                    }
                }
                else if (data.event === 'unsubscribe') {
                    const { symbol, timeframe } = data.payload;
                    if (symbol && timeframe) {
                        unsubscribeClient(socket, `market:${symbol}:${timeframe}`);
                    }
                }
                else if (data.event === 'subscribe_alerts') {
                    const { userId } = data.payload;
                    if (userId) {
                        subscribeClient(socket, `alerts:${userId}`);
                    }
                }
                else if (data.event === 'ping') {
                    socket.send(JSON.stringify({ event: 'pong' }));
                }
            }
            catch (err) {
                // Invalid JSON or message format
            }
        });
        socket.on('close', () => {
            removeClientFromAll(socket);
        });
    });
});
async function start() {
    try {
        await app.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`WS Gateway listening on port ${PORT}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}
start();
//# sourceMappingURL=server.js.map