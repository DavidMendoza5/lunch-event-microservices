FROM node:22-alpine

RUN addgroup -g 1001 appgroup && \
    adduser -D -u 1001 -G appgroup appuser

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN chown -R appuser:appgroup /app

USER appuser

RUN npm install --include=dev

COPY --chown=appuser:appgroup . .

EXPOSE 3000

CMD ["npm", "run", "dev"]