import * as dayModel from '../models/day.model.js';
import { ApiError } from '../utils/ApiError.js';
import { upload } from '../utils/storage.js';

export const find = (userId, dayNumber) => dayModel.find(userId, dayNumber);

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

  const newDay = await dayModel.create({
    ...day,
    progress_pic_key: await upload(user_id, file)
  });

  return newDay;
}

export const remove = (userId, dayNumber) => dayModel.remove(userId, dayNumber);
