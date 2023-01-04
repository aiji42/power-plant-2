import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as process from "process";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_CLIENT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const getSignedUploadUrl = async (
  code: string,
  filename: string
): Promise<string> => {
  return await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: `${code}/${filename}`,
    }),
    { expiresIn: 3600 }
  );
};
