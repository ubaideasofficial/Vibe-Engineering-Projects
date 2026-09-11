FROM mcr.microsoft.com/playwright:v1.49.1-noble

WORKDIR /app
COPY package.json package-lock.json tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
COPY supabase ./supabase

RUN npm ci
RUN npm run build

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "apps/api/dist/index.js"]