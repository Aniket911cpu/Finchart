# Technical Architecture Document (TAD)

## System Overview

```
┌─────────────────────────────────────────────────────┐
│              PRESENTATION LAYER                      │
├──────────────────┬──────────────────────────────────┤
│  Web App         │   Mobile App                     │
│  Next.js 15      │   Flutter 3.x (iOS + Android)    │
│  TypeScript      │   Dart, Riverpod state mgmt      │
│  TailwindCSS     │   Custom Canvas chart painter    │
│  Zustand         │   WebSocket via dart:io           │
│  Framer Motion   │   Biometric auth + FCM push      │
└──────────────────┴──────────────────────────────────┘
           │ HTTPS/WSS              │ HTTPS/WSS
┌──────────▼────────────────────────────────────────────┐
│              API GATEWAY (Nginx + Kong)               │
│  SSL Termination │ Rate Limiting │ JWT Pre-check      │
│  Request Routing │ Load Balancing │ CORS              │
└───────┬───────────────┬───────────────┬───────────────┘
        │               │               │
┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────────┐
│  Auth Service│ │ Market Svc  │ │  WS Gateway    │
│  /auth/*     │ │ /market/*   │ │  ws://...      │
│  JWT + OAuth │ │ OHLCV+Quote │ │  Redis Pub/Sub │
└──────┬───────┘ └──────┬──────┘ └─────┬──────────┘
       │                │               │
┌──────▼────────────────▼───────────────▼────────────────┐
│               SHARED SERVICES LAYER                     │
│  Watchlist Svc │ Alert Svc │ Drawing Svc │ AI Svc      │
│  Layout Svc    │ Search Svc│ Notif. Svc  │ News Svc    │
└─────────────────────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────┐
│              DATA LAYER                                  │
│  PostgreSQL 16  │ Redis 7  │ TimescaleDB │ S3/R2        │
│  (Users/Meta)   │ (Cache)  │ (OHLCV TS)  │ (Files)     │
└─────────────────────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────┐
│           DATA INGESTION LAYER (Worker)                  │
│  Binance Adapter │ Polygon Adapter │ Twelve Adapter      │
│  Finnhub Adapter │ AlphaVantage Adapter                  │
│  SmartRouter → picks provider by asset class             │
│  BullMQ jobs: alert checker, candle aggregator           │
└──────────────────────────────────────────────────────────┘
```

---

## Web Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| Styling | TailwindCSS | 3.x |
| State | Zustand | 4.x |
| Server State | TanStack Query (React Query) | 5.x |
| Charts | lightweight-charts | 5.x |
| Animation | Framer Motion | 11.x |
| Auth | NextAuth.js | 5.x |
| HTTP | Native fetch + custom client | — |

---

## Backend Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 20 LTS |
| Framework | Fastify | 4.x |
| Language | TypeScript | 5.x |
| ORM | Prisma | 5.x |
| Database | PostgreSQL + TimescaleDB | 16 |
| Cache/Queue | Redis + BullMQ | 7.x / 4.x |
| WebSocket | ws | 8.x |
| Validation | Zod | 3.x |
| Auth | @fastify/jwt | 9.x |

---

## Mobile Tech Stack (Flutter)

| Layer | Technology |
|-------|-----------|
| Framework | Flutter 3.x, Dart 3.x |
| State Management | Riverpod (flutter_riverpod) |
| HTTP | Dio + Retrofit |
| WebSocket | dart:io WebSocket / web_socket_channel |
| Charts | fl_chart + custom Canvas painter |
| Auth | flutter_secure_storage (JWT), local_auth (biometric) |
| Notifications | firebase_messaging + flutter_local_notifications |
| Storage | Hive (local DB for offline caching) |
| Navigation | go_router |
| CI/CD | Fastlane + GitHub Actions → App Store + Play Store |

### Why Flutter for Mobile
- Zerodha chose Flutter for their Kite mobile rewrite — their best technical decision
- Flutter renders via Impeller (own GPU engine), no JS bridge → 60fps on financial charts
- Single codebase: iOS + Android + Web + Desktop
- Better canvas control for custom chart painters
- Dart compiles to native ARM → lowest latency

---

## Infrastructure

| Component | Technology | Justification |
|-----------|-----------|--------------|
| Container Orchestration | Kubernetes (EKS) | Auto-scaling, self-healing |
| Service Mesh | Nginx Ingress | WebSocket upgrades, TLS termination |
| Container Registry | GitHub Container Registry | Free with GitHub Actions |
| DNS | Route 53 + Cloudflare | DDoS protection + CDN |
| Secrets | K8s Secrets (Vault in prod) | Secure injection |
| Monitoring | Prometheus + Grafana | Metrics + dashboards |
| Error Tracking | Sentry | Web + mobile |
| Logging | Pino + CloudWatch | Structured JSON logs |

---

## Data Flow: Real-time Candle Update

```
Binance WS → Worker Adapter → Redis PUBLISH market:candle:BTC/USDT:1h
                                     ↓
                              WS Gateway SUBSCRIBE
                                     ↓
                        For each subscribed user client:
                              WS Gateway → WebSocket → Browser
                                     ↓
                              React State Update (Zustand)
                                     ↓
                              lightweight-charts updateData()
```

## Data Flow: Alert Trigger

```
Redis market:quote:BTC/USDT → BullMQ alertChecker job
                                     ↓
                              Check active alerts in PostgreSQL
                                     ↓
                   [If condition met] → Save AlertHistory
                                     ↓
                              Redis PUBLISH user:{userId}:alerts
                                     ↓
                         WS Gateway → Browser notification
                              + SendGrid email (if enabled)
                              + FCM push (if mobile)
```
