import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';
import client from '../../storage/client.js';
import * as dayModel from '../models/day.model.js';
import * as milestoneService from '../services/milestone.service.js';
import * as summaryService from '../services/summary.service.js';
import { ApiError } from '../utils/ApiError.js';

export async function find(userId, dayNumber) {
  const day = await dayModel.find(userId, dayNumber);
  const signedUrl = await getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: day.progress_pic_key
    }),
    { expiresIn: 60 * 60 * 24 * 7 }
  );

  return { ...day, progress_pic_url: signedUrl };
}
export const findAll = userId => dayModel.findAll(userId);

export async function create(day, file) {
  const { user_id, day_number } = day;

  if (day_number > 1) {
    const prevDay = await find(user_id, day_number - 1);
    if (!prevDay) {
      throw new ApiError(
        `Day ${
          day_number - 1
        } must be completed before creating day ${day_number}.`,
        400
      );
    }
  }

  const ext = file.mimetype === 'image/png' ? 'png' : 'jpg';
  const key = `${user_id}/${uuid()}.${ext}`;
  const bucket = process.env.S3_BUCKET;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: file.buffer,
      ContentType: file.mimetype,
      Key: key
    })
  );

  const newDay = await dayModel.insert({
    ...day,
    progress_pic_key: key
  });

  await milestoneService.awardBadgeIfEligible(newDay);
  console.log(newDay['day_number']);

  if (newDay['day_number'] % 7 === 0) {
    const week = newDay['day_number'] / 7;
    await summaryService.create(user_id, week);
  }
  return newDay;
}
