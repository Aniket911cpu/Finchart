# Software Requirements Specification (SRS)

**Version:** 1.0 | **Format:** IEEE 830 Compliant

---

## 1. Introduction

### 1.1 Purpose
This SRS defines the complete functional and non-functional requirements for FinChart Pro, a full-scale web and mobile financial charting and trading analysis platform.

### 1.2 Scope
The system consists of:
- Web Application (Next.js 15, TypeScript)
- Mobile Application (Flutter 3.x, Dart)
- Backend API (Node.js/Fastify + Prisma)
- WebSocket Gateway (Node.js + ws)
- Background Worker (BullMQ + Redis)
- Data Ingestion Service (Provider Adapters)

### 1.3 Definitions
| Term | Definition |
|------|-----------|
| OHLCV | Open, High, Low, Close, Volume |
| WS | WebSocket |
| JWT | JSON Web Token |
| SMA | Simple Moving Average |
| MTF | Multi-TimeFrame |

---

## 2. Functional Requirements

### FR-001: AUTHENTICATION
| ID | Requirement |
|----|-------------|
| FR-001.1 | Users shall register with email + password |
| FR-001.2 | System shall support Google, Apple, GitHub OAuth |
| FR-001.3 | JWT access tokens expire in 15 minutes |
| FR-001.4 | Refresh tokens stored httpOnly cookie, 7-day TTL |
| FR-001.5 | Users shall enable 2FA via TOTP (Google Authenticator) |
| FR-001.6 | Password reset via email OTP (6-digit, 10min expiry) |
| FR-001.7 | Session list with per-device revocation |

### FR-002: CHARTING
| ID | Requirement |
|----|-------------|
| FR-002.1 | System shall render candlestick charts using lightweight-charts v5 on WebGL canvas |
| FR-002.2 | Minimum 50 timeframes supported (1s → 1M) |
| FR-002.3 | Chart shall support zoom (scroll), pan (drag), pinch-to-zoom on mobile |
| FR-002.4 | Crosshair shows OHLCV tooltip on hover |
| FR-002.5 | Chart shall load 1,000 bars on initial render |
| FR-002.6 | Historical data loaded in 1,000-bar chunks on leftward scroll |
| FR-002.7 | Last candle updates in real-time via WebSocket without full chart reload |
| FR-002.8 | Multi-chart layout: 1, 2, 4, 6, 8 simultaneous charts |
| FR-002.9 | Charts synchronize crosshair position when linked |
| FR-002.10 | Symbol change loads new data without page reload |

### FR-003: INDICATORS
| ID | Requirement |
|----|-------------|
| FR-003.1 | Minimum 30 built-in indicators at MVP launch |
| FR-003.2 | Indicators calculated client-side for low latency |
| FR-003.3 | Indicator parameters editable via settings panel |
| FR-003.4 | Multiple instances of same indicator allowed |
| FR-003.5 | Indicators auto-reload on new data arrival |
| FR-003.6 | Overlay indicators render on main price chart |
| FR-003.7 | Separate-pane indicators (RSI, MACD) in resizable sub-panels |
| FR-003.8 | Indicator visibility toggle without deletion |

### FR-004: DRAWING TOOLS
| ID | Requirement |
|----|-------------|
| FR-004.1 | Minimum 15 drawing tool types at MVP |
| FR-004.2 | Drawings are interactive: selectable, draggable, editable |
| FR-004.3 | Drawings save automatically to backend on release |
| FR-004.4 | Drawings load per symbol+timeframe combination |
| FR-004.5 | Undo/redo stack (minimum 50 actions) |
| FR-004.6 | Drawing style editor (color, thickness, line style, fill opacity) |

### FR-005: WATCHLIST
| ID | Requirement |
|----|-------------|
| FR-005.1 | Users create unlimited watchlists (Pro), 3 (Free) |
| FR-005.2 | Watchlist items show real-time price via WS |
| FR-005.3 | Columns: Symbol, Last Price, Change, Change%, Volume, Market Cap, Sparkline |
| FR-005.4 | Drag-and-drop reordering persists to backend |
| FR-005.5 | Symbol search with typeahead (debounced 300ms) |
| FR-005.6 | Share watchlist via public link |

### FR-006: ALERTS
| ID | Requirement |
|----|-------------|
| FR-006.1 | Create price alerts with conditions: crosses_above, crosses_below, >=, <=, == |
| FR-006.2 | Multi-condition alerts: (RSI > 70) AND (Price > MA) |
| FR-006.3 | Alert evaluation ≤ 500ms after trigger condition met |
| FR-006.4 | Delivery channels: in-app, email, web push, webhook |
| FR-006.5 | Alert expiry: fire-once, until-cancelled, N-times |
| FR-006.6 | Max 10 alerts (Free), unlimited (Pro) |
| FR-006.7 | Alert history with triggered timestamps |

---

## 3. Non-Functional Requirements

### NFR-001: PERFORMANCE
| Metric | Target |
|--------|--------|
| Chart first meaningful data | < 1 second (P95) |
| API response time | < 200ms (P95) authenticated |
| WebSocket tick delivery | < 50ms latency (P95) |
| Alert trigger to notification | < 500ms |
| Mobile app startup | < 2 seconds (cold start) |
| Lighthouse Performance score | ≥ 90 |

### NFR-002: SCALABILITY
| Metric | Target |
|--------|--------|
| Concurrent WebSocket connections | 100,000 per gateway pod |
| API throughput | 10,000 req/sec at peak |
| Historical data storage | 5 years of tick data per symbol |
| Redis cache hit rate | ≥ 95% for latest quotes |

### NFR-003: AVAILABILITY
- Platform SLA: 99.9% uptime (< 8.7 hours downtime/year)
- Planned maintenance via blue-green deployment (zero downtime)
- WS reconnection with exponential backoff (max 30s)
- Graceful degradation: use cached data if provider is down

### NFR-004: SECURITY
- All traffic over TLS 1.3
- JWT signed RS256 (asymmetric keys)
- Passwords hashed bcrypt (cost factor 12)
- Rate limiting: 100 req/min unauthenticated, 1000/min auth
- API input validated via Zod schema on all endpoints
- SQL injection prevention via Prisma ORM (parameterized)
- XSS prevention via Next.js CSP headers

---

## 4. External Interfaces

### 4.1 Market Data APIs
| Provider | Usage |
|----------|-------|
| Binance WebSocket API | Crypto real-time |
| Polygon.io REST + WebSocket | US stocks |
| TwelveData REST | Forex, global stocks |
| Finnhub WebSocket | News, earnings |
| AlphaVantage REST | Commodities, indices |

### 4.2 Authentication
- Google OAuth 2.0, Apple Sign-In, GitHub OAuth

### 4.3 Notifications
- SendGrid (email), Firebase Cloud Messaging (mobile push), Web Push API, Twilio (SMS)

### 4.4 AI Services
- OpenAI GPT-4o API (chart summary, AI assistant)

### 4.5 Storage
- AWS S3 / Cloudflare R2 (chart screenshots, avatars)
