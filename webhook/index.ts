import fastify from "fastify";
import { $ } from "zx";
import {
  S3Client,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import * as path from "path";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_CLIENT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

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
  R extends Record<string, unknown> | null,
  O extends Record<string, unknown> | null
> = {
  type: "DELETE" | "INSERT" | "UPDATE";
  table: string;
  record: R;
  schema: string;
  old_record: O;
};

app.post("/download-task", async (request, reply) => {
  const data = request.body as SupabaseWebhookData<{ id: string }, null>;
  if (data.type === "INSERT" && data.table === "DownloadTask") {
    const log =
      await $`gcloud beta batch jobs submit download-job-${createRandomString(
        16
      )} --location asia-southeast1 --config ./configs/download-job.json`;
    return reply.code(200).send({ message: log.message, stdout: log.stdout });
  }
  return reply.code(401).send({ message: "invalid request" });
});

app.post("/compress-task", async (request, reply) => {
  const data = request.body as SupabaseWebhookData<{ id: string }, null>;
  if (data.type === "INSERT" && data.table === "CompressTask") {
    const log =
      await $`gcloud beta batch jobs submit compress-job-${createRandomString(
        16
      )} --location asia-southeast1 --config ./configs/compress-job.json`;
    return reply.code(200).send({ message: log.message, stdout: log.stdout });
  }
  return reply.code(401).send({ message: "invalid request" });
});

app.post("/media", async (request, reply) => {
  const data = request.body as SupabaseWebhookData<
    null,
    {
      bucket: string;
      key: string;
      url: string;
    }
  >;
  if (data.type === "DELETE" && data.table === "Media") {
    const removeObjects = async (continuationToken?: string) => {
      const res = await S3.send(
        new ListObjectsV2Command({
          Bucket: data.old_record.bucket,
          Prefix: `${path.dirname(data.old_record.key)}/`,
          ContinuationToken: continuationToken,
        })
      );

      await S3.send(
        new DeleteObjectsCommand({
          Bucket: data.old_record.bucket,
          Delete: { Objects: res.Contents.map(({ Key }) => ({ Key })) },
        })
      );
      if (res.NextContinuationToken)
        return removeObjects(res.NextContinuationToken);
    };
    await removeObjects();
    reply.code(200).send({ message: `deleted media ${data.old_record.url}` });
  }
});

app.listen({ port: Number(process.env.PORT || 3000), host: "0.0.0.0" });
