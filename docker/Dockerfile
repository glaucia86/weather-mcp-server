FROM node:20-alpine

WORKDIR /app

# Copy package files and install ALL dependencies (including devDependencies for TypeScript compilation)
COPY package*.json ./
RUN npm ci

# Copy TypeScript configuration and source code
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript
RUN npx tsc

# Create logs directory
RUN mkdir -p logs

# Remove devDependencies after compilation to keep image smaller
RUN npm prune --omit=dev

CMD ["node", "dist/index.js"]