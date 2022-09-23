import fastify from "fastify";
import { $ } from "zx";

const app = fastify({ logger: true });

app.get("/", async (request, reply) => {
  await $`ls -l`;
  reply.code(200).send({
    hello: "world",
    httpVersion: request.raw.httpVersion,
  });
});

app.listen(process.env.PORT || 3000, "0.0.0.0");
