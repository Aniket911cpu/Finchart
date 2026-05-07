# Development Roadmap

**Start Date:** May 2026 | **MVP Target:** Q3 2026 | **Format:** 2-week sprints

---

## Phase 1 — Foundation (Weeks 1–4) ✅ COMPLETE

| Week | Deliverable | Status |
|------|-------------|--------|
| 1 | Monorepo setup, Turborepo config, Prisma schema (core models) | ✅ |
| 1 | PostgreSQL + TimescaleDB + Redis infrastructure | ✅ |
| 2 | Fastify API scaffold, JWT auth, basic routes | ✅ |
| 2 | Next.js 15 App Router scaffold, TailwindCSS, design system | ✅ |
| 3 | WebSocket gateway, Redis Pub/Sub integration | ✅ |
| 3 | Market data adapters (Binance, TwelveData) | ✅ |
| 4 | Lightweight-charts integration, candlestick rendering | ✅ |
| 4 | Symbol search, basic watchlist | ✅ |

---

## Phase 2 — Core Chart Features (Weeks 5–8) ✅ COMPLETE

| Week | Deliverable | Status |
|------|-------------|--------|
| 5 | 10+ Technical indicators (SMA, EMA, MACD, RSI, BB, VWAP) | ✅ |
| 5 | Indicator settings panel, multiple instances | ✅ |
| 6 | Drawing tools (10 types): trend line, horizontal, fib, rectangle | ✅ |
| 6 | Drawing persistence to backend | ✅ |
| 7 | Multi-chart layout system (1, 2, 4 panels) | ✅ |
| 7 | Synchronized crosshair across panels | ✅ |
| 8 | Alerts system (price + basic indicator alerts) | ✅ |
| 8 | Alert delivery: in-app + email | ✅ |

---

## Phase 3 — Platform Features (Weeks 9–12) ✅ COMPLETE

| Week | Deliverable | Status |
|------|-------------|--------|
| 9 | Watchlist enhancements (columns, sparklines, reordering) | ✅ |
| 9 | IndexedDB caching for historical OHLCV | ✅ |
| 10 | Explore page (market stats, trending, movers, news) | ✅ |
| 10 | Alerts dashboard with history | ✅ |
| 11 | User settings (profile, notifications, API keys) | ✅ |
| 11 | Layout save/restore from backend | ✅ |
| 12 | Landing page + marketing copy | ✅ |
| 12 | Platform sidebar navigation | ✅ |

---

## Phase 4 — Production Hardening (Weeks 13–16) ✅ COMPLETE

| Week | Deliverable | Status |
|------|-------------|--------|
| 13 | Docker multi-stage builds (all 4 services) | ✅ |
| 13 | Kubernetes manifests (all 8 resources) | ✅ |
| 14 | Nginx production config (TLS, rate limiting, WS) | ✅ |
| 14 | GitHub Actions CI/CD pipeline | ✅ |
| 15 | AI endpoints (chart summary, AI ask, pattern detection) | ✅ |
| 15 | Auth module expansion (register, login, forgot-pw, 2FA stub) | ✅ |
| 16 | Notifications system (in-app CRUD) | ✅ |
| 16 | Production Docker Compose for staging | ✅ |

---

## Phase 5 — Growth Features (Weeks 17–24) 🔄 NEXT

| Sprint | Deliverable | Priority |
|--------|-------------|----------|
| S9 | Flutter mobile app scaffold + navigation | P0 |
| S9 | Mobile chart screen (custom painter) | P0 |
| S10 | Mobile auth (biometric + JWT) | P0 |
| S10 | Mobile watchlist + real-time quotes | P0 |
| S11 | Bar Replay feature (web) | P1 |
| S11 | Visual backtesting (no-code) | P1 |
| S12 | Paper trading module | P1 |
| S12 | Social ideas: publish + comment + like | P2 |

---

## Phase 6 — Monetization (Weeks 25–32)

| Sprint | Deliverable | Priority |
|--------|-------------|----------|
| S13 | Stripe integration + plan gating | P0 |
| S13 | Freemium feature limits enforcement | P0 |
| S14 | Broker API integration (Zerodha + Alpaca) | P1 |
| S14 | Live order placement from chart | P1 |
| S15 | Options chain visualization | P2 |
| S15 | FinScript editor (Pine Script compatible) | P2 |
| S16 | Community marketplace (indicator scripts) | P2 |

---

## Key Milestones

| Milestone | Date | Criteria |
|-----------|------|---------|
| Internal Alpha | Q3 2026 | Core charting, alerts, auth, WS working |
| Beta Launch | Q3 2026 | Mobile app available, 100 beta users |
| Public v1.0 | Q4 2026 | Stripe payments live, 1,000 users |
| Series A Ready | 2027 | 25,000 MAU, 8% paid conversion |
