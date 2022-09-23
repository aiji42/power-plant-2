import fastify from "fastify";

const app = fastify({ logger: true });

app.get("/", function (request, reply) {
  reply.code(200).send({
    hello: "world",
    httpVersion: request.raw.httpVersion,
  });
});

app.listen(process.env.PORT || 3000, "0.0.0.0");
