import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const pubClient = new Redis(REDIS_URL);
const subClient = new Redis(REDIS_URL);
const prisma = new PrismaClient();
let activeAlerts = [];
let previousPrices = {};
// Fetch alerts periodically
async function refreshAlerts() {
    try {
        activeAlerts = await prisma.alert.findMany();
    }
    catch (e) {
        console.error('Failed to fetch alerts:', e);
    }
}
export function startAlertProcessor() {
    console.log('Starting Alert Processor...');
    // Refresh alerts every 10 seconds
    refreshAlerts();
    setInterval(refreshAlerts, 10000);
    subClient.psubscribe('market:*:1m', (err) => {
        if (err)
            console.error('Failed to subscribe to market data for alerts', err);
    });
    subClient.on('pmessage', async (pattern, channel, message) => {
        try {
            const tick = JSON.parse(message);
            const symbol = tick.symbol;
            const currentPrice = tick.close;
            const prevPrice = previousPrices[symbol];
            // Update prev price
            previousPrices[symbol] = currentPrice;
            if (!prevPrice)
                return;
            const symbolAlerts = activeAlerts.filter(a => a.symbol === symbol);
            for (const alert of symbolAlerts) {
                let triggered = false;
                switch (alert.condition) {
                    case 'ABOVE':
                        triggered = currentPrice > alert.price && prevPrice <= alert.price;
                        break;
                    case 'BELOW':
                        triggered = currentPrice < alert.price && prevPrice >= alert.price;
                        break;
                    case 'CROSS':
                        triggered = (currentPrice > alert.price && prevPrice <= alert.price) ||
                            (currentPrice < alert.price && prevPrice >= alert.price);
                        break;
                }
                if (triggered) {
                    console.log(`Alert triggered for user ${alert.userId}: ${symbol} ${alert.condition} ${alert.price}`);
                    // Publish to Redis so WS Gateway can send it to the specific user
                    pubClient.publish(`alerts:${alert.userId}`, JSON.stringify({
                        id: alert.id,
                        symbol: alert.symbol,
                        condition: alert.condition,
                        price: alert.price,
                        message: alert.message,
                        timestamp: new Date().toISOString()
                    }));
                    // Delete the alert since it's a one-time trigger
                    // Also remove from activeAlerts to prevent double triggers
                    activeAlerts = activeAlerts.filter(a => a.id !== alert.id);
                    await prisma.alert.delete({ where: { id: alert.id } }).catch(e => {
                        console.error('Failed to delete triggered alert:', e);
                    });
                }
            }
        }
        catch (e) {
            console.error('Error processing alert tick:', e);
        }
    });
}
//# sourceMappingURL=alertProcessor.js.map