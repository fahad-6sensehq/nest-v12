FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build && pnpm prune --prod

FROM alpine:3.24 AS runner

WORKDIR /app

RUN apk add --no-cache libstdc++

ENV NODE_ENV=production

COPY --from=builder /usr/local/bin/node /usr/local/bin/node
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 5000

CMD ["node", "dist/main.js"]
