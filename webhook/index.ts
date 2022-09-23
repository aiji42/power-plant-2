import fastify from "fastify";
import { $ } from "zx";

const app = fastify({ logger: true });

app.get("/", async (request, reply) => {
  await $`gcloud beta batch jobs submit download-job --location asia-southeast1 --config ./configs/download-job.json`;
  reply.code(200).send({
    hello: "world",
    httpVersion: request.raw.httpVersion,
  });
});

app.listen(process.env.PORT || 3000, "0.0.0.0");
