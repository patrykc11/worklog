FROM node:18

WORKDIR /app

COPY ./package.json ./
COPY ./pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

CMD ["pnpm", "run", "start"]