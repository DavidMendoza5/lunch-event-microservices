FROM node:22-alpine AS base
RUN addgroup -g 1001 appgroup && \
    adduser -D -u 1001 -G appgroup appuser
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN chown -R appuser:appgroup /app
USER appuser

FROM base AS dev
RUN npm install
COPY --chown=appuser:appgroup . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS prod
RUN npm install
COPY --chown=appuser:appgroup . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
