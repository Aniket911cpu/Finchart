# Deployment Architecture

## Production Environment (AWS)

```
[Cloudflare CDN + DDoS Protection + WAF]
           │
    ┌──────▼──────┐
    │  Route 53   │  DNS
    │  ALB        │  Load Balancer (HTTPS + WSS)
    └──────┬──────┘
           │ EKS (Kubernetes — namespace: finchart)
    ┌──────▼──────────────────────────────────────────┐
    │                                                   │
    │  web-deployment (2–8 pods)*    → Next.js 15      │
    │  api-deployment (2–10 pods)*   → Fastify API     │
    │  ws-deployment  (2–20 pods)*   → WS Gateway      │
    │  worker-deployment (2 pods)    → BullMQ Worker   │
    │  * HPA auto-scales on CPU > 70%                  │
    └───────────────────────────────────────────────────┘
           │
    ┌──────▼──────────────────────────────────────────┐
    │  DATA LAYER                                       │
    │  RDS PostgreSQL (Multi-AZ, r6g.large)            │
    │  ElastiCache Redis Cluster (3 shards)            │
    │  TimescaleDB on EC2 (r6g.2xlarge, RAID EBS)      │
    │  S3 (avatars, chart screenshots, exports)        │
    └───────────────────────────────────────────────────┘
```

---

## Kubernetes Manifest Files

| File | Description |
|------|-------------|
| `namespace.yaml` | Creates `finchart` namespace |
| `secrets.yaml` | K8s secrets template (fill before deploying) |
| `api.yaml` | API Deployment + Service + HPA |
| `web.yaml` | Web Deployment + Service + HPA |
| `ws-gateway.yaml` | WS Gateway Deployment + Service + HPA |
| `worker.yaml` | Worker Deployment |
| `postgres.yaml` | PostgreSQL StatefulSet + Service |
| `redis.yaml` | Redis StatefulSet + Service |
| `ingress.yaml` | Nginx Ingress with TLS + WS upgrade headers |

### Apply All Manifests
```bash
# 1. Apply namespace first
kubectl apply -f infra/k8s/namespace.yaml

# 2. Apply secrets (fill in values first!)
kubectl apply -f infra/k8s/secrets.yaml

# 3. Apply data layer
kubectl apply -f infra/k8s/postgres.yaml
kubectl apply -f infra/k8s/redis.yaml

# 4. Apply applications
kubectl apply -f infra/k8s/api.yaml
kubectl apply -f infra/k8s/web.yaml
kubectl apply -f infra/k8s/ws-gateway.yaml
kubectl apply -f infra/k8s/worker.yaml

# 5. Apply ingress
kubectl apply -f infra/k8s/ingress.yaml
```

---

## Staging Environment

Single-node Docker Compose on a Hetzner CX31 (€10/mo):
```bash
# Deploy to staging
docker-compose -f docker-compose.prod.yml up -d
```

---

## Development Environment

```bash
# Start infrastructure
docker-compose up -d postgres redis

# Run all services with hot reload
pnpm dev
```

---

## CI/CD Pipeline (.github/workflows/deploy.yml)

```
On push to main:
  1. test:   pnpm install → turbo lint → turbo build
  2. build:  Docker multi-stage build × 4 services → push to GHCR
  3. deploy: kubectl set image → rollout status verify
```

---

## Cost Estimate (Monthly, MVP Scale)

| Service | Cost |
|---------|------|
| EKS Cluster | ~$150 |
| RDS PostgreSQL (Multi-AZ) | ~$80 |
| ElastiCache Redis | ~$60 |
| EC2 TimescaleDB | ~$120 |
| Route 53 + ALB | ~$30 |
| S3 + CloudFront | ~$20 |
| Cloudflare Pro | ~$20 |
| SendGrid (10K/mo) | $0 (free tier) |
| Firebase FCM | $0 (free tier) |
| OpenAI API | ~$50 |
| **Total** | **~$530/month** |

> **Break-even:** 36 Pro subscribers at $15/mo

---

## Monitoring Stack

| Tool | Purpose |
|------|---------|
| Prometheus + Grafana | Metrics, dashboards, alerting |
| Sentry | Error tracking (web + mobile) |
| Pino | Structured JSON API logging |
| CloudWatch | AWS infrastructure logs |
| k6 | Load testing (10K concurrent users) |
