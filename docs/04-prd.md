# Product Requirements Document (PRD)

**Version:** 1.0 | **Date:** May 2026 | **Status:** APPROVED FOR DEVELOPMENT

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| Product | FinChart Pro — Financial Trading Analysis Platform |
| Type | Web Application + Mobile Application (iOS + Android) |
| Target Market | Retail traders, active investors, quant traders, crypto traders (India focus, global expansion) |
| Revenue Model | Freemium SaaS + Broker Commission + Marketplace |

---

## 2. Problem Statement

Current solutions fail in at least one of:
- **a)** AI-powered analysis (TradingView has ZERO native AI)
- **b)** True mobile-first experience (all competitors adapt web to mobile)
- **c)** Accessible pricing for emerging markets (India, SEA, LATAM)
- **d)** Portfolio + charting in one place
- **e)** Non-coder backtesting and strategy building
- **f)** DEX/DeFi charting with TradFi in one terminal

---

## 3. Target Users

### Primary Users
- **Active Retail Trader** (Age 22–45, uses multiple screens, trades daily)
- **Crypto Enthusiast** (trades on CEX + DEX, mobile-first)
- **Long-term Investor** (wants portfolio tracking + technical views)

### Secondary Users
- Finance Student / Learner
- Financial Advisor / Portfolio Manager
- Quant Developer (scripting + API access)

### India Personas
- NSE/BSE F&O Trader using Zerodha/Upstox
- Crypto Trader on WazirX/CoinDCX
- NRI tracking Indian + US markets

---

## 4. Success Metrics (KPIs)

| Metric | Target |
|--------|--------|
| DAU/MAU ratio | > 40% |
| Chart sessions avg duration | > 10 minutes |
| Freemium → Pro conversion | > 8% (vs TV's ~5%) |
| Mobile DAU | ≥ Web DAU |
| Alert trigger response time | < 500ms |
| WebSocket tick latency | < 50ms (P95) |
| Chart render time | < 100ms |
| App Store rating | ≥ 4.7 |
| Monthly churn | < 3% |

---

## 5. Product Scope

### In Scope (MVP)
- ✅ Web app (Next.js 15)
- ✅ Mobile app (Flutter)
- ✅ Multi-asset charting (Stocks, Crypto, Forex, Commodities, Indices)
- ✅ 25+ technical indicators
- ✅ 15+ drawing tools
- ✅ Real-time WebSocket data streaming
- ✅ Watchlists with real-time prices
- ✅ Multi-condition alerts with push/email
- ✅ JWT authentication + OAuth
- ✅ Responsive dark-mode UI
- ✅ AI Chart Summary (GPT-4o integration)
- ✅ Symbol search + screener basics

### In Scope (Post-MVP, v1.5)
- ✅ Bar Replay + Visual Backtesting
- ✅ Paper Trading
- ✅ Social ideas + community
- ✅ News + Economic Calendar
- ✅ Advanced AI features

### Out of Scope (v2.0+)
- ❌ Live broker trading execution
- ❌ Options chain full analytics
- ❌ FinScript scripting engine
- ❌ Copy trading

---

## 6. Feature Priority Matrix

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| P0 | Chart Engine + WS Streaming | High | Critical |
| P0 | Auth + User System | Med | Critical |
| P0 | Watchlist + Alerts | Med | High |
| P1 | 25+ Indicators | Med | High |
| P1 | Drawing Tools (10 types) | Med | High |
| P1 | Multi-layout Dashboard | High | High |
| P1 | Mobile App (Flutter) | High | Critical |
| P2 | AI Chart Summary | Low | Very High |
| P2 | Screener | Med | High |
| P2 | Bar Replay | High | Med |
| P2 | Social Ideas Feed | High | Med |
| P3 | Portfolio Tracker | High | High |
| P3 | FinScript Engine | Very High | Med |

---

## 7. Constraints

- **Market data:** Provider API rate limits (handle gracefully)
- **Regulatory:** No financial advice; disclaimer required on all signals
- **SEBI:** India broker integration requires SEBI-approved API
- **GDPR / IT Act:** User data residency compliance
- **Budget:** Start with 2–3 developers, scale post-revenue
- **Timeline:** MVP in 16 weeks

---

## 8. Assumptions

- Users have modern browsers (Chrome 100+, Safari 15+)
- Mobile users on iOS 14+ / Android 9+
- Real-time data latency acceptable < 500ms for alerts
- Free tier on Binance, TwelveData APIs sufficient for MVP traffic
