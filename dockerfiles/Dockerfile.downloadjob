FROM node:16-bullseye-slim as base

WORKDIR /app
RUN apt-get update && apt-get install -y aria2 tini python python3-pip ffmpeg
RUN pip install awscli

FROM base as installer

COPY ./jobs/download/package.json ./jobs/download/
COPY ./jobs/download/yarn.lock ./jobs/download/
COPY ./db/prisma/schema.prisma ./db/prisma/schema.prisma

WORKDIR /app/jobs/download
RUN yarn install

FROM base as job

COPY --from=installer /app/jobs/download/node_modules ./node_modules
COPY ./jobs/download /app

ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_DEFAULT_REGION
ARG R2_CLIENT_ID
ARG DATABASE_URL
ARG R2_PUBLIC_URL

ENV AWS_ACCESS_KEY_ID $AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY $AWS_SECRET_ACCESS_KEY
ENV AWS_DEFAULT_REGION $AWS_DEFAULT_REGION
ENV R2_CLIENT_ID $R2_CLIENT_ID
ENV DATABASE_URL $DATABASE_URL
ENV R2_PUBLIC_URL $R2_PUBLIC_URL

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["yarn", "start"]