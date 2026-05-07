# Complete Master Feature List

## 🔵 Tier 1 — Core MVP Features (Launch)

### 1. Charting Engine
- Candlestick, Line, Area, Bar, Heikin Ashi, Renko, Range, Point & Figure, Kagi, Line Break charts
- 50+ timeframes: 1s, 5s, 15s, 30s, 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1D, 3D, 1W, 1M
- Logarithmic / Linear / Percentage / Indexed scale
- Multi-chart layout (1, 2×1, 2×2, 3×1, 3×2, 4×4, custom)
- Synchronized crosshair across multi-chart layouts
- Chart templates save/load
- Full-screen mode, Dark / Light / Custom themes
- Chart screenshot + share link
- Infinite historical scroll with lazy loading
- Volume bars overlay, Session shading, Extended trading hours

### 2. Technical Indicators
- **Trend:** SMA, EMA, WMA, DEMA, TEMA, HMA, VWMA, KAMA, ALMA
- **Momentum:** RSI, Stochastic RSI, CCI, Williams %R, ROC, Momentum
- **Volume:** VWAP, Anchored VWAP, OBV, A/D Line, Volume Profile (VPVR), CMF, MFI
- **Volatility:** Bollinger Bands, Keltner Channel, ATR, Donchian Channel, Standard Deviation
- **MACD family:** MACD, MACD Histogram, PPO, DPO
- **Trend Strength:** ADX, DMI, Aroon
- **Others:** Ichimoku Cloud, Parabolic SAR, Pivot Points (Classic, Fibonacci, Camarilla, Woodie, DM)
- Custom indicator builder (visual, no-code)
- Indicator scripting engine ("FinScript" — Pine Script compatible)
- Indicator marketplace (community-published)

### 3. Drawing Tools
- Trend Line, Ray, Extended Line, Horizontal Line, Vertical Line
- Pitchfork (Andrews, Schiff, Modified Schiff)
- Fibonacci Retracement, Extension, Fan, Arc, Circles
- Gann Fan, Gann Square, Gann Box
- Elliott Wave annotations
- Rectangle, Parallelogram, Triangle, Circle, Ellipse
- Long/Short Position Tool with risk/reward calculator
- Brush, Highlighter, Arrow, Callout, Text annotation
- Magnet mode (snap to OHLC), Drawing templates
- Auto-save drawings to cloud, sync across devices

### 4. Watchlist System
- Multiple named watchlists, drag-and-drop reordering
- Real-time price, change %, volume, market cap columns
- Mini sparkline charts per row
- Symbol search with exchange filtering
- Color labels per symbol, bulk import/export CSV
- Watchlist sharing (public link)

### 5. Alerts System
- Price level alerts (crosses above/below, touches, enters zone)
- Indicator alerts (RSI overbought/oversold, MACD cross, BB touch)
- Volume alerts (spike above average)
- Multi-condition alerts (AND/OR logic)
- Pattern recognition alerts
- Alert expiry (once, until cancelled, N times)
- Delivery: in-app, email, web push, SMS (Pro+), webhook
- Alert history and log, mobile push alerts

### 6. Asset Class Support
- **Stocks:** NSE, BSE, NYSE, NASDAQ, LSE, TSX, ASX + 50 more exchanges
- **Crypto:** 500+ pairs, spot + perpetual futures, DEX tokens
- **Forex:** 100+ currency pairs (majors, minors, exotics)
- **Commodities:** Gold, Silver, Oil (WTI/Brent), Natural Gas, Agricultural
- **Indices:** Nifty 50, Sensex, S&P 500, NASDAQ-100, FTSE, DAX, 200+ global
- **Futures:** Single stock, commodity, and index futures
- **ETFs:** 5,000+ global ETFs with holdings data
- **DeFi/DEX:** 22+ DEX support (Uniswap, Pancakeswap, etc.)

### 7. User Authentication
- Email + password signup/login
- Google OAuth, Apple Sign-In, GitHub OAuth
- JWT with refresh token rotation
- Email verification, password reset, 2FA (TOTP)
- Session management (view/revoke active sessions)

---

## 🟡 Tier 2 — Growth Features (3–6 Months Post-Launch)

### 8. AI Features (Primary Differentiator)
- **AI Chart Assistant** — Context-aware chart analysis chat
- **AI Pattern Detection** — ML model scanning for H&S, Double Top/Bottom, Triangles, Flags
- **AI Signal Score** — Composite score (0–100) combining trend, momentum, volume, sentiment
- **AI Trade Ideas** — Daily AI-curated trade ideas per asset class
- **AI Summary** — One-click natural language chart summary
- **Sentiment Analysis** — Social media + news sentiment per symbol
- **AI Screener** — Natural language screener queries

### 9. Screener / Scanner
- Real-time screener with 100+ filter criteria
- Pre-built templates (Oversold RSI, Golden Cross, Earnings Breakout)
- Custom screener with save + share, results as watchlist
- Heatmap view of screener results, sector heatmaps

### 10. Bar Replay & Backtesting
- Bar replay with 9 speeds, step-by-step candle advance
- Replay from any historical date, simulated trades during replay
- Visual strategy backtester (drag-and-drop, no code)
- Backtest report: equity curve, win rate, drawdown, Sharpe ratio
- Walk-forward optimization, Monte Carlo simulation

### 11. Paper Trading
- Virtual account with configurable capital
- Real-time paper order execution
- Portfolio tracker (unrealized P&L, realized P&L)
- Trade journal auto-fill, performance analytics dashboard

### 12. Social / Community
- Publish chart ideas with annotations
- Follow traders, like, comment, share
- Trending ideas feed (daily/weekly)
- Trader reputation score + badges
- Live streams (chart + voice)
- Community scripts (indicator) marketplace
- Copy trading engine (Phase 2)

---

## 🔴 Tier 3 — Advanced Platform (6–12 Months)

### 13. Scripting Engine ("FinScript")
- Pine Script v6-compatible syntax
- Visual no-code strategy builder as alternative
- Script editor with syntax highlighting, autocomplete
- Script library (public marketplace, private scripts)
- Webhook output for automation, AI-assisted script generation

### 14. Broker Integration
- Direct order placement from chart
- Market, limit, stop-loss, trailing stop, bracket orders
- Multi-broker: Zerodha, Upstox, Angel One, IBKR, Alpaca, Binance

### 15. Advanced Market Data
- Level 2 / Market Depth (order book)
- Time & Sales (tape)
- Volume Footprint charts
- DOM (Depth of Market) ladder
- Open Interest, Funding rates, Options flow
