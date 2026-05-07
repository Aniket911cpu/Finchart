# FinChart Pro — TradingView-Inspired Platform: Implementation Plan

## Overview

Build a production-grade, cloud-native financial charting and trading analysis platform inspired by TradingView. The project uses a **Turborepo monorepo** with a Next.js 15 frontend, Fastify backend, WebSocket gateway, background workers, and shared packages.

**Workspace:** `c:\Users\anike\Music\Finchart`

---

## User Review Required

> [!IMPORTANT]
> **API Keys Required** — The real-time market data layer requires at least one provider API key to function. For MVP development, recommend starting with:
> - **Binance** (free, no key needed for public WebSocket streams — crypto only)
> - **TwelveData** (free tier: 800 req/day — stocks + forex + crypto)
> - **Polygon.io** (free tier: end-of-day data only; paid for real-time)
>
> Please confirm which providers you have keys for, or if you'd prefer to use **mock/simulated data** during initial development.

> [!IMPORTANT]
> **Scope Decision — Phase 1 First or Full Stack?**
> This blueprint has ~15 weeks of work across 5 phases. I recommend we:
> - **Option A**: Build Phase 1 + 2 only (Foundation + Core Charting) — a fully working charting terminal with real data in ~6 weeks of build time
> - **Option B**: Scaffold the entire monorepo structure with all phases stubbed out, then iterate feature by feature
> - **Option C**: Full MVP in one pass (all 5 phases) — longer but complete
>
> **Recommendation: Option A** — get a working terminal first, then iterate.

> [!WARNING]
> **Dependencies on System Tools** — This project requires:
> - Node.js 20+
> - pnpm 8+
> - Docker Desktop (for PostgreSQL + Redis locally)
> - Git
>
> Please confirm these are installed, or I'll set up the project without Docker (using a cloud Postgres + Redis instead).

---

## Open Questions

1. **Authentication providers:** OAuth with Google only, or also GitHub/Apple?
2. **Initial asset classes:** Start with Crypto only (Binance free), or Crypto + Stocks from day 1?
3. **Deployment target:** Local Docker Compose only for now, or deploy to a cloud provider (Hetzner, Railway, Vercel)?
4. **Design language:** The blueprint specifies a dark terminal theme. Do you want a light mode toggle from day 1?
5. **Mobile:** Should the MVP include a mobile-responsive PWA, or desktop-first only?

---

## Proposed Changes

### Phase 1 — Monorepo Foundation & Auth (Weeks 1–3)

#### [NEW] Monorepo Root
- `turbo.json` — Turborepo pipeline config
- `package.json` — pnpm workspace root
- `pnpm-workspace.yaml`
- `docker-compose.yml` — PostgreSQL (TimescaleDB) + Redis
- `.env.example`

#### [NEW] `packages/types/`
- `src/market.ts` — OHLCV, Tick, SymbolInfo interfaces
- `src/user.ts` — User, Session, Plan enums
- `src/alerts.ts` — Alert, AlertType, AlertCondition
- `src/chart.ts` — ChartType, IndicatorConfig, Drawing types

#### [NEW] `packages/config/`
- Shared ESLint, TypeScript, and Tailwind configs

#### [NEW] `apps/api/` — Fastify Backend
- `prisma/schema.prisma` — Full schema (Users, Sessions, Watchlists, Alerts, Drawings, Layouts, Notifications, MarketSymbol)
- `src/modules/auth/` — Register, Login, Logout, Refresh, OAuth
- `src/middleware/` — Auth, rate limiting, Zod validation, error handling
- `src/shared/` — Redis client, Prisma client, Pino logger

#### [NEW] `apps/web/` — Next.js 15 App Shell
- `src/app/layout.tsx` — Root layout with dark theme
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/landing/page.tsx` — Full landing page
- `src/styles/globals.css` — Design system tokens
- `src/store/authStore.ts` — Zustand auth slice

---

### Phase 2 — Core Charting Engine (Weeks 4–6)

#### [NEW] `packages/data-adapters/`
- `src/base.adapter.ts` — MarketAdapter interface
- `src/binance.adapter.ts` — Binance REST + WS
- `src/twelvedata.adapter.ts` — TwelveData REST
- `src/provider.factory.ts` — Factory + SmartProviderRouter

#### [NEW] `apps/api/src/modules/market/`
- `market.controller.ts` — OHLCV, quote, search, trending
- `market.service.ts` — Aggregates from adapters + Redis cache
- `market.router.ts`

#### [NEW] `apps/ws-gateway/`
- `src/server.ts` — Fastify + ws + Redis Pub/Sub
- Heartbeat ping/pong (30s interval)
- Channel format: `market:{symbol}:{timeframe}`

#### [NEW] `apps/web/src/components/chart/`
- `ChartEngine.tsx` — lightweight-charts v5 wrapper
- `CandlestickSeries.tsx`, `LineSeries.tsx`, `AreaSeries.tsx`
- `VolumeOverlay.tsx`, `Crosshair.tsx`
- `ChartToolbar.tsx`, `TimeframeSelector.tsx`

#### [NEW] `apps/web/src/hooks/`
- `useWebSocket.ts` — WS client manager with auto-reconnect
- `useMarketData.ts` — TanStack Query + IndexedDB cache
- `useChart.ts` — Chart state orchestration

#### [NEW] `apps/web/src/store/chartStore.ts`
- Zustand slice: symbol, timeframe, chartType, indicators, drawings

---

### Phase 3 — Trading Terminal UI (Weeks 7–9)

#### [NEW] `apps/web/src/app/(platform)/terminal/page.tsx`
- Full terminal layout with resizable panels (`react-grid-layout`)

#### [NEW] `apps/web/src/components/terminal/`
- `TerminalLayout.tsx`, `LeftSidebar.tsx`, `RightSidebar.tsx`
- `BottomPanel.tsx`, `TopBar.tsx`

#### [NEW] `apps/web/src/components/watchlist/`
- `WatchlistPanel.tsx`, `WatchlistItem.tsx`
- `WatchlistSearch.tsx`, `WatchlistDragSort.tsx` (dnd-kit)

#### [NEW] `packages/indicator-engine/`
- `src/indicators.ts` — SMA, EMA, RSI, MACD, Bollinger Bands, VWAP, Stochastic RSI
- `src/custom.interface.ts` — Plugin interface for custom indicators

#### [NEW] `apps/web/src/components/indicators/`
- `IndicatorPicker.tsx`, `SMAOverlay.tsx`, `EMAOverlay.tsx`
- `RSIPanel.tsx`, `MACDPanel.tsx`, `BollingerBands.tsx`

---

### Phase 4 — Drawing Tools & Alerts (Weeks 10–12)

#### [NEW] `apps/web/src/components/drawing/`
- `DrawingToolbar.tsx`
- `TrendLine.tsx`, `HorizontalLine.tsx`, `FibRetracement.tsx`
- `RectangleZone.tsx`, `PositionTool.tsx`, `TextAnnotation.tsx`

#### [NEW] `apps/api/src/modules/alerts/`
- Alert CRUD, toggle endpoint

#### [NEW] `apps/worker/`
- `src/jobs/alertEvaluator.ts` — Bull queue; checks price against conditions on each tick
- `src/jobs/marketIngestion.ts` — Ingests data, publishes to Redis Pub/Sub
- Email (SendGrid) + Web Push (Firebase) notification delivery

---

### Phase 5 — Polish & Production (Weeks 13–15)

#### [NEW] `apps/web/src/app/(platform)/explore/page.tsx`
#### [NEW] `apps/web/src/app/(platform)/alerts/page.tsx`
#### [NEW] `apps/web/src/app/(platform)/settings/page.tsx`
#### [NEW] `apps/web/src/lib/idb-cache.ts` — IndexedDB historical OHLCV cache
#### [NEW] `infra/docker/` — Production Dockerfiles
#### [NEW] `infra/k8s/` — Kubernetes manifests (API, Web, WS, HPA)
#### [NEW] `infra/nginx/nginx.conf`
#### [NEW] `.github/workflows/deploy.yml` — CI/CD pipeline

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Monorepo | Turborepo + pnpm workspaces |
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Charts | lightweight-charts v5 (TradingView, Apache 2.0) |
| State | Zustand + TanStack Query |
| Animations | Framer Motion |
| Layout | react-grid-layout + dnd-kit |
| Backend | Fastify + TypeScript |
| ORM | Prisma + PostgreSQL (TimescaleDB) |
| Cache | Redis (ioredis) |
| WebSocket | ws + Redis Pub/Sub |
| Job Queue | BullMQ |
| Auth | JWT RS256 + next-auth |
| Validation | Zod (shared) |
| Logging | Pino |
| Infra | Docker Compose → Kubernetes |
| CI/CD | GitHub Actions |

---

## Verification Plan

### Automated Tests
- `pnpm turbo test` — Unit tests for indicator engine calculations
- `pnpm turbo lint` — ESLint across all packages
- `pnpm turbo build` — Verify all apps compile

### Manual Verification
- Chart renders BTC/USD candlestick data
- Real-time tick updates via WebSocket
- Authentication flow (register → login → protected route)
- Alert fires correctly when price condition is met
- Drawing tools persist across page refresh
- Watchlist drag-and-drop reorder works

---

## Immediate Next Steps (awaiting your approval)

1. Run `pnpm init` + Turborepo scaffold in `c:\Users\anike\Music\Finchart`
2. Set up `docker-compose.yml` for local PostgreSQL + Redis
3. Initialize Next.js 15 app in `apps/web`
4. Initialize Fastify API in `apps/api` with Prisma schema
5. Build landing page + auth pages
