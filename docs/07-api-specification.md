# API Specification

**Base URL:** `https://api.finchart.pro/v1`  
**Auth:** `Authorization: Bearer <access_token>`

---

## Authentication Endpoints

### POST /auth/register
```json
Body:    { "email": "user@example.com", "username": "trader1", "password": "...", "displayName": "Trader" }
Response: { "user": {...}, "accessToken": "eyJ..." }
Errors:  409 (email/username taken), 422 (validation)
```

### POST /auth/login
```json
Body:    { "email": "user@example.com", "password": "..." }
Response: { "user": {...}, "accessToken": "eyJ..." }
Sets:    HttpOnly cookie (refreshToken)
```

### POST /auth/refresh
```
Cookie:  refreshToken
Response: { "accessToken": "eyJ..." }
Behavior: Rotates refresh token (sliding window)
```

### POST /auth/oauth/:provider
```
Params:  provider = google | apple | github
Response: Redirect → OAuth flow → { "accessToken": "..." }
```

### GET /auth/me
```json
Response: { "id": "...", "email": "...", "username": "...", "plan": "FREE|PRO|ENTERPRISE", "avatar": "...", "settings": {...} }
```

### POST /auth/forgot-password
```json
Body:    { "email": "user@example.com" }
Response: { "message": "If that email exists, a reset link has been sent." }
```

### POST /auth/logout
```
Behavior: Revokes refresh token in Redis
```

---

## Market Data Endpoints

### GET /market/ohlcv
```
Query:   symbol, timeframe, from (unix), to (unix), limit
Response: { "symbol": "BTC/USDT", "timeframe": "1h", "data": OHLCV[] }
Cache:   Redis, TTL = 1 completed candle duration
```

### GET /market/quote/:symbol
```json
Response: {
  "symbol": "BTC/USDT",
  "price": 68500.00,
  "change": 1250.00,
  "changePct": 1.86,
  "high24h": 69200.00,
  "low24h": 67100.00,
  "volume": 45231.5,
  "marketCap": 1350000000000,
  "lastUpdated": "2026-05-07T10:00:00Z"
}
```

### GET /market/quotes/batch
```json
Body:    { "symbols": ["BTC/USDT", "ETH/USDT", "AAPL"] }
Response: { "BTC/USDT": Quote, "ETH/USDT": Quote, "AAPL": Quote }
```

### GET /market/search
```
Query:   q, type (stock|crypto|forex|commodity|index), exchange, limit
Response: { "results": SymbolInfo[] }
```

### GET /market/trending
```
Query:   category (all|crypto|stock|forex), limit
Response: { "trending": TrendingSymbol[] }
```

### GET /market/stats
```json
Response: {
  "globalMarketCap": 2500000000000,
  "volume24h": 85000000000,
  "btcDominance": 52.4,
  "fearAndGreed": { "value": 74, "classification": "Greed" }
}
```

### GET /market/movers
```
Query:   type (gainers|losers)
Response: TopMover[]
```

### GET /market/news
```
Query:   symbol?, limit?
Response: NewsItem[]
```

---

## Watchlist Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /watchlists | List all user watchlists |
| POST | /watchlists | Create new watchlist |
| GET | /watchlists/:id | Get watchlist with items |
| PUT | /watchlists/:id | Rename watchlist |
| DELETE | /watchlists/:id | Delete watchlist |
| POST | /watchlists/:id/symbols | Add symbol(s) |
| DELETE | /watchlists/:id/symbols/:symbol | Remove symbol |
| PATCH | /watchlists/:id/reorder | Update sort orders |
| GET | /watchlists/:id/share | Get public share token |
| POST | /watchlists/import | Import from public token |

---

## Alerts Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /alerts | List user alerts |
| POST | /alerts | Create alert |
| GET | /alerts/:id | Get single alert |
| PUT | /alerts/:id | Update alert |
| DELETE | /alerts/:id | Delete alert |
| PATCH | /alerts/:id/toggle | Activate/deactivate |
| GET | /alerts/history | Alert trigger history |

### POST /alerts — Request Body
```json
{
  "symbol": "BTC/USDT",
  "name": "BTC breaks 70k",
  "type": "PRICE",
  "conditions": [{ "field": "price", "operator": "CROSSES_ABOVE", "value": 70000 }],
  "logic": "AND",
  "expiry": "ONCE",
  "channels": ["IN_APP", "EMAIL", "PUSH"],
  "webhookUrl": null
}
```

---

## User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /user/settings | Get user settings |
| PATCH | /user/settings | Update settings |
| GET | /user/api-keys | List API keys |
| POST | /user/api-keys | Generate API key |
| DELETE | /user/api-keys/:id | Revoke API key |

---

## Notifications Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /notifications | Paginated list |
| GET | /notifications/unread-count | Unread badge count |
| PATCH | /notifications/:id/read | Mark one as read |
| POST | /notifications/read-all | Mark all as read |
| DELETE | /notifications/clear | Clear read notifications |

---

## AI Endpoints

### POST /ai/chart-summary
```json
Body:     { "symbol": "BTC/USDT", "timeframe": "1h", "context": "optional" }
Response: {
  "summary": "BTC is forming a bullish flag pattern...",
  "sentiment": "BULLISH",
  "keyLevels": [{ "type": "resistance", "price": 70000, "label": "Round number" }],
  "patterns": ["Bullish Flag"]
}
Rate limit: 10/day (Free), 100/day (Pro)
```

### POST /ai/ask (SSE Streaming)
```json
Body:     { "question": "What does this RSI divergence mean?", "symbol": "BTC/USDT" }
Response: { "answer": "RSI divergence occurs when..." }
```

### POST /ai/patterns
```json
Body:     { "symbol": "BTC/USDT", "timeframe": "4h" }
Response: { "patterns": [], "signalScore": 72 }
```
