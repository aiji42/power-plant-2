import fastify from "fastify";
import { $ } from "zx";

const createRandomString = (length: number) => {
  const S = "0123456789abcdefghijklmnopqrstuvwxyz";
  let rnd = "";
  for (let i = 0; i < length; i++) {
    rnd += S.charAt(Math.floor(Math.random() * S.length));
  }
  return rnd;
};

const app = fastify({ logger: true });

app.post("/download-task", async (request, reply) => {
  const log =
    await $`gcloud beta batch jobs submit download-job-${createRandomString(
      16
    )} --location asia-southeast1 --config ./configs/download-job.json`;
  reply.code(200).send({ message: log.message, stdout: log.stdout });
});

app.listen(process.env.PORT || 3000, "0.0.0.0");
