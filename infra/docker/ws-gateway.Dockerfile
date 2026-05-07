FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm i -g pnpm && pnpm install --frozen-lockfile
RUN pnpm --filter @finchart/ws-gateway build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/ws-gateway/dist ./dist
COPY --from=builder /app/apps/ws-gateway/package.json .
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3002
CMD ["node", "dist/index.js"]
