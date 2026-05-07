# Security & Compliance

## Security Architecture

### Authentication & Authorization

| Layer | Implementation |
|-------|---------------|
| Password hashing | bcrypt (cost factor 12) |
| JWT signing | HS256 in dev, RS256 in production (asymmetric) |
| Access token TTL | 15 minutes |
| Refresh token | httpOnly Secure cookie, 7 days, rotating |
| 2FA | TOTP (RFC 6238) via Google Authenticator |
| OAuth | PKCE flow for Google/Apple/GitHub |
| Session management | Per-device, revocable from settings |

### Transport Security

- All traffic over **TLS 1.3** (1.2 rejected)
- HTTP → HTTPS 301 redirect at Nginx level
- HSTS header: `max-age=31536000; includeSubDomains; preload`
- Certificate rotation: auto-renewal via cert-manager (Let's Encrypt)
- DNS: Cloudflare proxy with DDoS protection

### API Security

| Control | Implementation |
|---------|---------------|
| Input validation | Zod schema on all request bodies and query params |
| SQL injection | Prisma ORM (parameterized queries — no raw SQL) |
| Rate limiting | 100 req/min (anon), 1,000 req/min (auth), 5 req/min (auth endpoints) |
| CORS | Whitelist: app.finchart.pro, localhost:3000 |
| CSP headers | Next.js security headers configuration |
| Auth endpoints | Extra aggressive rate limiting (5 attempts/min) → lockout 15min |
| API keys | SHA-256 hashed before storage |

---

## Data Security

### Encryption at Rest
- PostgreSQL: AWS RDS encrypted (AES-256, AWS KMS keys)
- S3: Server-side encryption (SSE-S3)
- Redis: At-rest encryption enabled
- Backup encryption: AES-256

### Sensitive Fields
| Field | Treatment |
|-------|-----------|
| passwordHash | bcrypt (never stored plain, never logged) |
| JWT secret | K8s secret, rotated quarterly |
| API keys | HMAC-SHA256 hash stored; prefix only shown in UI |
| Payment data | Never stored — handled by Stripe PCI scope |

### Data Minimization
- No financial advice provided (disclaimer on all signals)
- User location not stored (timezone only)
- IP addresses logged for security only, purged after 30 days
- Analytics: privacy-preserving, no PII sent to third parties

---

## Compliance Checklist

### GDPR (General Data Protection Regulation)

| Requirement | Implementation |
|-------------|---------------|
| Right to access | `GET /user/data-export` endpoint |
| Right to erasure | `DELETE /user/account` — hard delete all PII |
| Data portability | JSON export of watchlists, alerts, drawings |
| Privacy policy | Linked from all pages, signup |
| Cookie consent | Minimal cookies (httpOnly JWT only), no tracking |
| DPO contact | privacy@finchart.pro |

### India IT Act / DPDP Act 2023

| Requirement | Implementation |
|-------------|---------------|
| Data localization | India users: data in ap-south-1 (Mumbai) region |
| Consent collection | Explicit opt-in for email marketing |
| Grievance officer | grievance@finchart.pro (< 48hr response) |
| Data breach notification | Within 72 hours to CERT-In |

### SEBI Regulations (for Broker Integration)

| Requirement | Implementation |
|-------------|---------------|
| No investment advice | AI output always includes disclaimer |
| KYC for trading | Delegated to licensed broker partner |
| Order trail | Immutable audit log in database |
| API rate limits | Broker API limit enforcement in worker |

---

## Security Incident Response Plan

### Severity Levels

| Level | Description | Response Time | Example |
|-------|-------------|---------------|---------|
| P0 | Data breach affecting users | 1 hour | Database exfiltration |
| P1 | Auth bypass or privilege escalation | 4 hours | JWT forgery vulnerability |
| P2 | Service down or denial of service | 8 hours | API unavailable |
| P3 | Non-critical vulnerability | 72 hours | XSS in non-sensitive page |

### Breach Response Steps
1. **Detect** via Sentry alerts / Prometheus anomaly
2. **Contain** — isolate affected pods, revoke compromised tokens
3. **Assess** — determine scope, enumerate affected users
4. **Notify** — affected users via email within 72 hours
5. **Remediate** — patch, rotate secrets, re-deploy
6. **Post-mortem** — within 5 business days, publish RCA

---

## Penetration Testing Schedule

| Test Type | Frequency | Scope |
|-----------|-----------|-------|
| OWASP Top 10 scan | Pre-launch | Full application |
| API fuzzing | Quarterly | All endpoints |
| Dependency audit | Monthly | `pnpm audit` |
| Infrastructure scan | Quarterly | K8s + network |
| Social engineering | Annual | Team phishing simulation |

---

## Security Headers (Next.js)

```typescript
// next.config.ts
headers: [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; img-src * data:; connect-src 'self' wss://ws.finchart.pro https://api.finchart.pro" }
]
```
