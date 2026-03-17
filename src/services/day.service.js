import * as dayModel from '../models/day.model.js';
import * as milestoneService from '../services/milestone.service.js';

import { ApiError } from '../utils/ApiError.js';

export const find = (userId, dayNumber) => dayModel.find(userId, dayNumber);
export const findAll = userId => dayModel.findAll(userId);

export async function create(day) {
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

  const newDay = await dayModel.insert(day);
  await milestoneService.awardBadgeIfEligible(newDay);
  return newDay;
}
