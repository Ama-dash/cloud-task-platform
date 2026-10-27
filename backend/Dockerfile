FROM node:22-trixie-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM gcr.io/distroless/nodejs22-debian13:nonroot
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5000
USER nonroot
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD ["/nodejs/bin/node", "-e", "require('http').get('http://localhost:5000/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"]
CMD ["src/server.js"]