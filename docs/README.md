# FinChart Pro — Documentation

Welcome to the official documentation for **FinChart Pro**, the next-generation financial charting and trading analysis platform.

## Document Index

| # | Document | Description |
|---|----------|-------------|
| 01 | [Competitive Intelligence](./01-competitive-intelligence.md) | Deep-dive into TradingView, Bloomberg, and 10+ competitors |
| 02 | [Feature List](./02-feature-list.md) | Complete Tier 1, 2, and 3 feature catalog |
| 03 | [Product Vision](./03-vision.md) | Mission, vision, and product positioning |
| 04 | [PRD](./04-prd.md) | Product Requirements Document (full scope) |
| 05 | [SRS](./05-srs.md) | Software Requirements Specification (IEEE 830) |
| 06 | [Technical Architecture](./06-technical-architecture.md) | System components and tech stack |
| 07 | [API Specification](./07-api-specification.md) | All REST API endpoints with request/response |
| 08 | [WebSocket Specification](./08-websocket-specification.md) | Real-time event schema and channel naming |
| 09 | [Database Schema](./09-database-schema.md) | Full Prisma schema + ERD descriptions |
| 10 | [Mobile Architecture](./10-mobile-architecture.md) | Flutter Clean Architecture guide |
| 11 | [Deployment Architecture](./11-deployment-architecture.md) | AWS + Kubernetes deployment topology |
| 12 | [Development Roadmap](./12-roadmap.md) | 20-week sprint-by-sprint plan |
| 13 | [Monetization & Pricing](./13-monetization.md) | Pricing tiers and revenue model |
| 14 | [Security & Compliance](./14-security-compliance.md) | Security checklist and compliance requirements |

## Quick Start

```bash
# Clone and install
git clone https://github.com/aniket911cpu/finchart
cd finchart
pnpm install

# Start infrastructure
docker-compose up -d postgres redis

# Push database schema
cd apps/api && npx prisma db push && npx prisma generate && cd ../..

# Start all services
pnpm dev
```

## Architecture Overview

```
Web (Next.js 15) → Nginx → API (Fastify) → PostgreSQL/TimescaleDB
                         → WS Gateway  → Redis Pub/Sub
                         → Worker      → BullMQ Alerts
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web Frontend | Next.js 15, TypeScript, Zustand, TailwindCSS |
| Mobile | Flutter 3.x, Riverpod, Dart |
| API Backend | Fastify, Prisma, TypeScript |
| Database | PostgreSQL 16 + TimescaleDB |
| Cache/Queue | Redis 7, BullMQ |
| Real-time | WebSocket, Redis Pub/Sub |
| Infrastructure | Docker, Kubernetes, Nginx |
| CI/CD | GitHub Actions → GHCR → K8s |
