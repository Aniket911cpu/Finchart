# Database Schema Documentation

## Overview

FinChart Pro uses **PostgreSQL 16 with TimescaleDB** extension for time-series OHLCV data, and **Prisma ORM** for type-safe database access.

---

## Entity Relationship Overview

```
User ─┬── Account (OAuth providers)
      ├── Session (active sessions)
      ├── Watchlist ── WatchlistItem
      ├── Alert ── AlertHistory
      ├── Layout
      ├── Drawing
      ├── SavedIndicator
      ├── Notification
      ├── UserSettings (1:1)
      ├── ApiKey (1:N)
      ├── PaperAccount (1:1) ── PaperOrder
      │                      └── PaperPosition
      ├── Idea ── IdeaComment
      │        └── IdeaLike
      ├── Follow (self-referential)
      ├── SavedScreener
      └── Script
```

---

## Core Models

### User
Primary entity for all authenticated users.

| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| email | String (unique) | Email address |
| username | String (unique) | Display handle |
| passwordHash | String? | bcrypt hash (null for OAuth users) |
| plan | Enum(FREE/PRO/ENTERPRISE) | Subscription tier |
| bio | String? | Profile bio |
| timezone | String | User timezone (default UTC) |

### Watchlist / WatchlistItem
Users can have multiple named watchlists. Each item tracks a symbol with sort order for drag-and-drop.

### Alert
Stores alert conditions. Supports PRICE, INDICATOR, VOLUME, PERCENT_CHANGE types with conditions: CROSSES_ABOVE, CROSSES_BELOW, GREATER_THAN, LESS_THAN, EQUALS.

### AlertHistory
Immutable audit log of triggered alerts with price at trigger time.

### Layout
JSON blob storing the user's dashboard panel configuration (positions, sizes, active widgets).

### Drawing
Per-symbol, per-timeframe drawing objects. Uses versioning for optimistic locking during sync.

---

## Social Models

### Idea
Community chart idea publications with sentiment (BULLISH/BEARISH/NEUTRAL), linked to a specific symbol and timeframe.

### Follow
Self-referential join table for follower/following relationships.

---

## Paper Trading Models

### PaperAccount
Virtual trading account with configurable starting balance. Each user has exactly one paper account.

### PaperOrder
Simulated orders with full order type support: MARKET, LIMIT, STOP_LOSS, TRAILING_STOP.

### PaperPosition
Open and closed positions with realized/unrealized P&L tracking.

---

## TimescaleDB Schema (OHLCV)

OHLCV data is stored in TimescaleDB hypertables for efficient time-series queries:

```sql
CREATE TABLE ohlcv (
  time        TIMESTAMPTZ NOT NULL,
  symbol      TEXT NOT NULL,
  timeframe   TEXT NOT NULL,
  open        DOUBLE PRECISION,
  high        DOUBLE PRECISION,
  low         DOUBLE PRECISION,
  close       DOUBLE PRECISION,
  volume      DOUBLE PRECISION
);

-- Convert to hypertable (partition by time)
SELECT create_hypertable('ohlcv', 'time');

-- Compression policy (data older than 7 days compressed)
SELECT add_compression_policy('ohlcv', INTERVAL '7 days');

-- Retention policy (5 years of data)
SELECT add_retention_policy('ohlcv', INTERVAL '5 years');

-- Indexes for fast queries
CREATE INDEX ON ohlcv (symbol, timeframe, time DESC);
```

---

## Enum Reference

| Enum | Values |
|------|--------|
| Plan | FREE, PRO, ENTERPRISE |
| AssetClass | STOCK, CRYPTO, FOREX, COMMODITY, INDEX |
| AlertType | PRICE, INDICATOR, VOLUME, PERCENT_CHANGE |
| AlertCondition | CROSSES_ABOVE, CROSSES_BELOW, GREATER_THAN, LESS_THAN, EQUALS |
| DrawingType | TREND_LINE, HORIZONTAL_LINE, FIBONACCI, RECTANGLE, POSITION_TOOL, TEXT, BRUSH |
| NotificationType | ALERT_TRIGGERED, SYSTEM, PRICE_MOVEMENT, NEWS |
| Sentiment | BULLISH, BEARISH, NEUTRAL |
| OrderSide | BUY, SELL |
| OrderType | MARKET, LIMIT, STOP_LOSS, TRAILING_STOP |
| OrderStatus | PENDING, FILLED, CANCELLED, REJECTED |
| ScriptType | INDICATOR, STRATEGY, LIBRARY |
