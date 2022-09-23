FROM node:16-bullseye-slim as base

WORKDIR /app
RUN apt-get update && apt-get install -y apt-transport-https ca-certificates gnupg curl tini
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg  add - && \
    apt-get update && apt-get install -y google-cloud-cli

FROM base as installer

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

FROM base as job

COPY --from=installer /app/node_modules ./node_modules
COPY . /app

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["yarn", "start"]