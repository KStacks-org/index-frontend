# Stage 1: Build
FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.33.4 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
ARG BUILD_MODE=prod
RUN pnpm run build --mode "$BUILD_MODE"

# Stage 2: Production
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
