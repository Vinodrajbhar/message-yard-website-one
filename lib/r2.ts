import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let r2ClientInstance: S3Client | null = null;

/**
 * Returns a singleton instance of the S3Client configured for Cloudflare R2.
 */
export function getR2Client(): S3Client {
  if (!r2ClientInstance) {
    const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

    if (!accountId || !accessKeyId || !secretAccessKey) {
      console.warn(
        "[Cloudflare R2] Missing R2 credentials (CLOUDFLARE_R2_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY) in environment."
      );
    }

    r2ClientInstance = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId || "",
        secretAccessKey: secretAccessKey || "",
      },
    });
  }

  return r2ClientInstance;
}

/**
 * Generates an authenticated, time-limited presigned URL to stream/download an object from a private R2 bucket.
 *
 * @param key The object key inside the bucket (e.g. "videos/hero-demo.mp4")
 * @param expiresInSeconds Duration in seconds before the signed URL expires (default 3600 = 1 hour)
 */
export async function getR2SignedUrl(
  key: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  if (!bucket) {
    throw new Error("CLOUDFLARE_R2_BUCKET_NAME is not defined in environment variables.");
  }

  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

/**
 * Retrieves an object stream directly from private Cloudflare R2 with optional byte-range support.
 *
 * @param key The object key inside the bucket
 * @param range Optional HTTP Range header string (e.g. "bytes=0-1024")
 */
export async function getR2ObjectStream(key: string, range?: string) {
  const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  if (!bucket) {
    throw new Error("CLOUDFLARE_R2_BUCKET_NAME is not defined in environment variables.");
  }

  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    Range: range,
  });

  return client.send(command);
}

/**
 * Retrieves object metadata (size, content-type) from Cloudflare R2.
 */
export async function getR2ObjectMetadata(key: string) {
  const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  if (!bucket) {
    throw new Error("CLOUDFLARE_R2_BUCKET_NAME is not defined in environment variables.");
  }

  const client = getR2Client();
  const command = new HeadObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return client.send(command);
}
