import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';

const client = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_ACCESS_KEY
  },
  forcePathStyle: true
});

export async function upload(userId, file) {
  const ext = file.mimetype === 'image/png' ? 'png' : 'jpg';
  const key = `${userId}/${uuid()}.${ext}`;
  const bucket = process.env.S3_BUCKET;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: file.buffer,
      ContentType: file.mimetype,
      Key: key
    })
  );
  return key;
}

export const getUrl = key => {
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key
    }),
    { expiresIn: 60 * 60 * 24 * 7 }
  );
};
