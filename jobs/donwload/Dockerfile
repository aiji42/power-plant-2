FROM node:18-bullseye-slim as base

WORKDIR /app
RUN apt-get update && apt-get install -y aria2 tini python python3-pip ffmpeg
RUN pip install awscli

FROM base as installer

ARG DATABASE_URL

COPY package.json ./
COPY yarn.lock ./

RUN yarn install
RUN yarn db:prepare
RUN yarn db:generate

FROM base as job

COPY . /app
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/prisma ./prisma

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["yarn", "start"]