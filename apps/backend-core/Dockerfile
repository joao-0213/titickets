FROM node:20-alpine AS base
RUN npm install -g pnpm turbo
WORKDIR /app

FROM base AS pruner
ARG APP_NAME
COPY . .
RUN turbo prune --scope=${APP_NAME} --docker

FROM base AS builder
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install
COPY --from=pruner /app/out/full/ .
RUN turbo build --filter=${APP_NAME}

FROM node:20-alpine AS runner
WORKDIR /app
ARG APP_NAME
COPY --from=builder /app/apps/${APP_NAME}/dist ./dist
COPY --from=builder /app/apps/${APP_NAME}/node_modules ./node_modules
COPY --from=builder /app/apps/${APP_NAME}/package.json ./package.json

EXPOSE 3001
CMD ["node", "dist/main.js"]