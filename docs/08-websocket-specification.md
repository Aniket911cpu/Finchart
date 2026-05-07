# WebSocket Event Specification

**Endpoint:** `wss://ws.finchart.pro`

---

## Connection

```
URL:   wss://ws.finchart.pro?token=<accessToken>
Auth failure → close(4001, "UNAUTHORIZED")
Heartbeat: server sends PING every 30s
           client must PONG within 10s or connection closed
```

---

## Client → Server Events

### subscribe_candles
```json
{
  "event": "subscribe_candles",
  "payload": { "symbol": "BTC/USDT", "timeframe": "1h" }
}
```

### unsubscribe_candles
```json
{
  "event": "unsubscribe_candles",
  "payload": { "symbol": "BTC/USDT", "timeframe": "1h" }
}
```

### subscribe_quotes
```json
{
  "event": "subscribe_quotes",
  "payload": { "symbols": ["AAPL", "MSFT", "GOOGL"] }
}
```

### unsubscribe_quotes
```json
{
  "event": "unsubscribe_quotes",
  "payload": { "symbols": ["AAPL"] }
}
```

### subscribe_orderbook
```json
{
  "event": "subscribe_orderbook",
  "payload": { "symbol": "ETH/USDT", "depth": 20 }
}
```

### ping
```json
{ "event": "ping", "payload": { "ts": 1714000000000 } }
```

---

## Server → Client Events

### candle_update
```json
{
  "event": "candle_update",
  "payload": {
    "symbol": "BTC/USDT",
    "timeframe": "1h",
    "candle": {
      "time": 1714000000,
      "open": 60100.00,
      "high": 60550.00,
      "low": 59900.00,
      "close": 60342.50,
      "volume": 1234.56,
      "isClosed": false
    }
  }
}
```

### quote_update
```json
{
  "event": "quote_update",
  "payload": {
    "symbol": "AAPL",
    "price": 189.42,
    "change": 1.23,
    "changePct": 0.65,
    "volume": 42000000,
    "bid": 189.41,
    "ask": 189.43,
    "ts": 1714000000000
  }
}
```

### orderbook_update
```json
{
  "event": "orderbook_update",
  "payload": {
    "symbol": "ETH/USDT",
    "bids": [[3800.00, 15.5], [3799.50, 22.1]],
    "asks": [[3800.50, 8.2], [3801.00, 31.4]],
    "ts": 1714000000000
  }
}
```

### alert_triggered
```json
{
  "event": "alert_triggered",
  "payload": {
    "alertId": "clxxx",
    "symbol": "BTC/USDT",
    "message": "BTC/USDT crossed above $61,000",
    "triggeredAt": "2026-05-07T01:00:00Z"
  }
}
```

### notification
```json
{
  "event": "notification",
  "payload": {
    "id": "notif_xxx",
    "type": "ALERT_TRIGGERED",
    "title": "Alert Triggered",
    "body": "BTC crossed $61,000",
    "ts": 1714000000000
  }
}
```

### error
```json
{
  "event": "error",
  "payload": { "code": "SYMBOL_NOT_FOUND", "message": "Symbol 'XYZ/USDT' not found" }
}
```

---

## Redis Channel Naming Convention

| Channel Type | Pattern | Example |
|-------------|---------|---------|
| Candle | `market:candle:{SYMBOL}:{TIMEFRAME}` | `market:candle:BTC/USDT:1h` |
| Quote | `market:quote:{SYMBOL}` | `market:quote:AAPL` |
| Orderbook | `market:orderbook:{SYMBOL}` | `market:orderbook:ETH/USDT` |
| User Alerts | `user:{userId}:alerts` | `user:clxxx:alerts` |
| User Notifications | `user:{userId}:notifications` | `user:clxxx:notifications` |

---

## Reconnection Strategy

The client WebSocket library implements exponential backoff:

```typescript
const delays = [1000, 2000, 4000, 8000, 16000, 30000]; // ms
let attempt = 0;

function reconnect() {
  setTimeout(() => {
    attempt++;
    connect();
  }, delays[Math.min(attempt, delays.length - 1)]);
}
```

After reconnection, client re-sends all active subscriptions to restore state.
