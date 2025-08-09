FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY tsconfig.json ./
COPY src ./src

RUN npm install -g typescript
RUN tsc

RUN mkdir -p logs

CMD ["node", "dist/index.js"]