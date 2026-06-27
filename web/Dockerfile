FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

ENV HOST=0.0.0.0
EXPOSE 3000

CMD ["npm", "start"]
