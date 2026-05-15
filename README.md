# NestJS Microservices Monorepo Boilerplate

Production-friendly starter for a NestJS monorepo with:

- API Gateway HTTP app
- Users microservice
- Orders microservice
- NATS transport
- Shared `common` library
- Shared `contracts` library
- DTO validation
- Docker Compose for local NATS
- Strict TypeScript

## Architecture

```txt
HTTP Client
   |
   v
API Gateway  --->  NATS  --->  Users Service
      |              |
      |              +------->  Orders Service  ---> Users Service
      |
      +-- REST endpoints
```

## Apps

```txt
apps/gateway   HTTP REST API gateway
apps/users     Users microservice
apps/orders    Orders microservice
libs/common    Shared config, constants, helpers
libs/contracts Shared DTOs, message patterns, interfaces
```

## Requirements

- Node.js 20+
- Docker, for local NATS
- npm

## Setup

```bash
cp .env.example .env
npm install
npm run docker:up
npm run start:dev
```

Gateway runs on:

```txt
http://localhost:3000
```

NATS monitoring runs on:

```txt
http://localhost:8222
```

## REST API

### Health

```bash
curl http://localhost:3000/health
```

### Create user

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","name":"John Doe"}'
```

### Get user

```bash
curl http://localhost:3000/users/<USER_ID>
```

### Create order

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":"<USER_ID>","items":[{"productId":"sku_123","quantity":2}]}'
```

### Get order

```bash
curl http://localhost:3000/orders/<ORDER_ID>
```

## Scripts

```bash
npm run start:dev          # gateway + users + orders in watch mode
npm run dev:gateway        # gateway only
npm run dev:users          # users service only
npm run dev:orders         # orders service only
npm run build              # build all apps
npm run typecheck          # TypeScript check
npm test                   # Jest tests
npm run check              # lint + typecheck + test
npm run docker:up          # start NATS
npm run docker:down        # stop NATS
```

## Environment variables

```env
NODE_ENV=development
PORT=3000
NATS_URL=nats://localhost:4222
USERS_QUEUE=users-service
ORDERS_QUEUE=orders-service
RPC_TIMEOUT_MS=5000
```

Do not commit real secrets. Use your deployment platform's secret manager for production credentials.

## Adding another microservice

```bash
nest generate app payments
nest generate library payments-contracts
```

Then:

1. Add message patterns in `libs/contracts`.
2. Create DTOs in `libs/contracts`.
3. Register the client in `apps/gateway` or another service.
4. Add NATS microservice bootstrap in `apps/payments/src/main.ts`.
5. Add scripts in `package.json`.

## Notes

This starter intentionally keeps persistence in memory. Add PostgreSQL, Prisma, TypeORM, MongoDB, Redis, or another data layer only when you need it.
