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

type SupabaseWebhookData<
  T extends Record<string, unknown> = Record<string, any>
> = {
  data: {
    type: "DELETE" | "INSERT" | "UPDATE";
    table: string;
    record: null | unknown;
    schema: string;
    old_record: T;
  };
};

app.post("/download-task", async (request, reply) => {
  const log =
    await $`gcloud beta batch jobs submit download-job-${createRandomString(
      16
    )} --location asia-southeast1 --config ./configs/download-job.json`;
  reply.code(200).send({ message: log.message, stdout: log.stdout });
});

// app.post("/media", async (request, reply) => {
//   const { data } = request.body as SupabaseWebhookData<{ url: string }>;
//   if (data.type === "DELETE" && data.table === "Media") {
//     data.old_record.url;
//   }
//
//   reply.code(200).send({});
// });

app.listen(process.env.PORT || 3000, "0.0.0.0");
