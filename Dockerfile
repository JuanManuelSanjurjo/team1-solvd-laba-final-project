FROM node:22.18.0-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WEBSITE_NAME

ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WEBSITE_NAME=$NEXT_PUBLIC_WEBSITE_NAME

COPY package-lock.json package.json ./

RUN npm install
COPY . .
RUN npm run build

FROM node:22.18.0-alpine AS production

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

ENTRYPOINT ["node", "server.js"]